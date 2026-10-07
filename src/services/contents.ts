// Firestore Contents Input/Output 관리자 전용 서비스
// Input은 읽기 전용(/ingest가 scripts/upload.mjs로 올린다). Output은 조회·직접 추가·삭제가 가능하다(/draft가 자동 저장하거나 관리자가 직접 추가).
// firestore.rules의 isAdmin()이 실제 접근을 막으므로, 여기서는 관리자 계정으로 로그인했다는 전제로 호출한다.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { ContentsInputDoc, ContentsOutputDoc } from "../types";

const inputRef = collection(db, "contents_input");
const outputRef = collection(db, "contents_output");

function toDate(value: unknown): Date | null {
  return value ? (value as Timestamp).toDate() : null;
}

function toInput(id: string, data: DocumentData): ContentsInputDoc {
  const tags = data.tags ?? {};
  return {
    id,
    title: data.title || data.source_file || "(제목 없음)",
    sourceUrl: data.source_url ?? data.youtube_url ?? data.repo_path ?? null,
    tags: {
      category: tags.category ?? "",
      format: tags.format ?? "",
      targetAudience: tags.target_audience ?? "",
      performanceGrade: tags.performance_grade ?? "",
      publishedAt: tags.published_at ?? "",
      keyMessage: tags.key_message ?? "",
    },
    views: typeof data.views === "number" ? data.views : null,
    body: data.body ?? "",
  };
}

export async function listContentsInput(): Promise<ContentsInputDoc[]> {
  const snapshot = await getDocs(inputRef);
  return snapshot.docs
    .map((d) => toInput(d.id, d.data()))
    .sort((a, b) => b.tags.publishedAt.localeCompare(a.tags.publishedAt));
}

function toOutput(id: string, data: DocumentData): ContentsOutputDoc {
  return {
    id,
    title: data.title ?? "(제목 없음)",
    type: data.type ?? "",
    sourceIds: Array.isArray(data.sourceIds) ? data.sourceIds : [],
    body: data.body ?? "",
    meta: data.meta ?? null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listContentsOutput(): Promise<ContentsOutputDoc[]> {
  const snapshot = await getDocs(query(outputRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((d) => toOutput(d.id, d.data()));
}

export async function createContentsOutput(
  title: string,
  type: string,
  sourceIds: string[],
  body: string,
): Promise<void> {
  await addDoc(outputRef, {
    title: title.trim(),
    type: type.trim(),
    sourceIds,
    body: body.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function deleteContentsOutput(id: string): Promise<void> {
  await deleteDoc(doc(outputRef, id));
}
