// 질문 상세 + 답변 목록/작성 페이지
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ANSWER_CONTENT_MAX,
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  getQuestion,
  listAnswers,
} from "../services/board";
import { AuthorBadge } from "../components/AuthorBadge";
import type { BoardAnswer, BoardQuestion } from "../types";

const deleteButtonClass = "text-xs text-red-600 hover:underline dark:text-red-400";

export function QnaDetailPage() {
  const { questionId = "" } = useParams();
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<BoardQuestion | null>(null);
  const [answers, setAnswers] = useState<BoardAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 답변 등록/삭제 후 값을 올려 질문과 답변을 다시 불러온다.
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    Promise.all([getQuestion(questionId), listAnswers(questionId)])
      .then(([nextQuestion, nextAnswers]) => {
        setQuestion(nextQuestion);
        setAnswers(nextAnswers);
      })
      .catch(() => setError("질문을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [questionId, reloadKey]);

  const handleAnswer = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createAnswer(user, questionId, content);
      setContent("");
      reload();
    } catch {
      setError("답변을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("질문과 달린 답변을 모두 삭제할까요?")) return;
    try {
      await deleteQuestion(questionId);
      navigate("/qna");
    } catch {
      setError("질문을 삭제하지 못했습니다.");
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!window.confirm("답변을 삭제할까요?")) return;
    try {
      await deleteAnswer(questionId, answerId);
      reload();
    } catch {
      setError("답변을 삭제하지 못했습니다.");
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중…</p>;
  }

  if (!question) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">{error ?? "질문을 찾을 수 없습니다."}</p>
        <Link to="/qna" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/qna" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← 목록으로
      </Link>

      <article className="space-y-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{question.title}</h1>
          {user?.uid === question.authorId && (
            <button type="button" onClick={handleDeleteQuestion} className={deleteButtonClass}>
              삭제
            </button>
          )}
        </div>
        <AuthorBadge author={question} createdAt={question.createdAt} />
        <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{question.content}</p>
      </article>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">답변 {answers.length}</h2>
        {answers.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">아직 답변이 없습니다.</p>
        )}
        <ul className="space-y-3">
          {answers.map((answer) => (
            <li
              key={answer.id}
              className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between gap-3">
                <AuthorBadge author={answer} createdAt={answer.createdAt} />
                {user?.uid === answer.authorId && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAnswer(answer.id)}
                    className={deleteButtonClass}
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{answer.content}</p>
            </li>
          ))}
        </ul>
      </section>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {user ? (
        <form onSubmit={handleAnswer} className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={ANSWER_CONTENT_MAX}
            rows={4}
            placeholder="답변을 입력하세요."
            aria-label="답변 내용"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "등록 중…" : "답변 등록"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={signInWithGoogle}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          로그인하고 답변하기
        </button>
      )}
    </div>
  );
}
