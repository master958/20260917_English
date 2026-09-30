// 질문 게시판 목록 + 새 질문 작성 폼 페이지
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  createQuestion,
  listQuestions,
  QUESTION_CONTENT_MAX,
  QUESTION_TITLE_MAX,
  type QuestionCursor,
} from "../services/board";
import { AuthorBadge } from "../components/AuthorBadge";
import type { BoardQuestion } from "../types";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

export function QnaListPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<BoardQuestion[]>([]);
  const [cursor, setCursor] = useState<QuestionCursor>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listQuestions()
      .then(({ questions: first, nextCursor }) => {
        setQuestions(first);
        setCursor(nextCursor);
      })
      .catch(() => setError("질문 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoading(true);
    try {
      const { questions: next, nextCursor } = await listQuestions(cursor);
      setQuestions((prev) => [...prev, ...next]);
      setCursor(nextCursor);
    } catch {
      setError("질문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const id = await createQuestion(user, title, content);
      navigate(`/qna/${id}`);
    } catch {
      setError("질문을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">질문 게시판</h1>
        {user ? (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "작성 취소" : "질문하기"}
          </button>
        ) : (
          <button
            type="button"
            onClick={signInWithGoogle}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            로그인하고 질문하기
          </button>
        )}
      </div>

      {user && showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={QUESTION_TITLE_MAX}
            placeholder="제목"
            aria-label="질문 제목"
            className={inputClass}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={QUESTION_CONTENT_MAX}
            rows={6}
            placeholder="궁금한 문법이나 표현을 자세히 적어주세요."
            aria-label="질문 내용"
            className={inputClass}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.length} / {QUESTION_CONTENT_MAX}
            </span>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "등록 중…" : "등록"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!loading && questions.length === 0 && !error && (
        <p className="text-gray-500 dark:text-gray-400">아직 질문이 없습니다. 첫 질문을 남겨보세요!</p>
      )}

      <ul className="space-y-3">
        {questions.map((question) => (
          <li key={question.id}>
            <Link
              to={`/qna/${question.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium text-gray-900 dark:text-gray-100">{question.title}</h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    question.answerCount > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  답변 {question.answerCount}
                </span>
              </div>
              <div className="mt-2">
                <AuthorBadge author={question} createdAt={question.createdAt} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중…</p>}
      {!loading && cursor && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full rounded-md border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          더 보기
        </button>
      )}
    </div>
  );
}
