// Firestore 질문 게시판 서비스
// 구조: questions/{questionId} (제목·내용·작성자·답변수), questions/{questionId}/answers/{answerId}
// 목록은 페이지 단위(20개)로만 읽어 Spark 무료 읽기 한도(일 5만)를 아낀다.
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";
import type { BoardAnswer, BoardQuestion } from "../types";

export const QUESTION_TITLE_MAX = 100;
export const QUESTION_CONTENT_MAX = 2000;
export const ANSWER_CONTENT_MAX = 1000;
const PAGE_SIZE = 20;

const questionsRef = collection(db, "questions");
const answersRef = (questionId: string) => collection(db, "questions", questionId, "answers");

function toDate(value: unknown): Date | null {
  return value ? (value as Timestamp).toDate() : null;
}

function authorFields(user: User) {
  return {
    authorId: user.uid,
    authorName: user.displayName ?? user.email ?? "익명",
    authorPhoto: user.photoURL ?? null,
  };
}

function toQuestion(id: string, data: DocumentData): BoardQuestion {
  return {
    id,
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhoto: data.authorPhoto ?? null,
    answerCount: data.answerCount ?? 0,
    createdAt: toDate(data.createdAt),
  };
}

export type QuestionCursor = QueryDocumentSnapshot<DocumentData> | null;

export async function listQuestions(
  cursor: QuestionCursor = null,
): Promise<{ questions: BoardQuestion[]; nextCursor: QuestionCursor }> {
  const constraints = cursor
    ? [orderBy("createdAt", "desc"), startAfter(cursor), limit(PAGE_SIZE)]
    : [orderBy("createdAt", "desc"), limit(PAGE_SIZE)];
  const snapshot = await getDocs(query(questionsRef, ...constraints));
  const questions = snapshot.docs.map((d) => toQuestion(d.id, d.data()));
  const nextCursor = snapshot.docs.length === PAGE_SIZE ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { questions, nextCursor };
}

export async function getQuestion(questionId: string): Promise<BoardQuestion | null> {
  const snapshot = await getDoc(doc(questionsRef, questionId));
  return snapshot.exists() ? toQuestion(snapshot.id, snapshot.data()) : null;
}

export async function createQuestion(user: User, title: string, content: string): Promise<string> {
  const ref = await addDoc(questionsRef, {
    title: title.trim(),
    content: content.trim(),
    ...authorFields(user),
    answerCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// 질문을 지울 때 달린 답변도 함께 지운다 (하위 컬렉션은 자동 삭제되지 않음).
export async function deleteQuestion(questionId: string): Promise<void> {
  const answers = await getDocs(answersRef(questionId));
  const batch = writeBatch(db);
  answers.docs.forEach((answer) => batch.delete(answer.ref));
  batch.delete(doc(questionsRef, questionId));
  await batch.commit();
}

export async function listAnswers(questionId: string): Promise<BoardAnswer[]> {
  const snapshot = await getDocs(query(answersRef(questionId), orderBy("createdAt", "asc")));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      authorPhoto: data.authorPhoto ?? null,
      createdAt: toDate(data.createdAt),
    };
  });
}

// 답변 추가와 답변 수 증가를 한 번에 처리한다.
export async function createAnswer(user: User, questionId: string, content: string): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(answersRef(questionId)), {
    content: content.trim(),
    ...authorFields(user),
    createdAt: serverTimestamp(),
  });
  batch.update(doc(questionsRef, questionId), { answerCount: increment(1) });
  await batch.commit();
}

export async function deleteAnswer(questionId: string, answerId: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(answersRef(questionId), answerId));
  batch.update(doc(questionsRef, questionId), { answerCount: increment(-1) });
  await batch.commit();
}
