// 콘텐츠 스튜디오(260927contents 저장소)가 모은 원본(Contents Input)과 만든 결과물(Contents Output)을 보는 운영자 전용 페이지.
// Input은 /ingest가 올린 데이터를 읽기만 한다. Output은 /draft가 자동 저장하거나, 여기서 직접 추가·삭제할 수 있다.
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AdminGate } from "../components/AdminGate";
import {
  createContentsOutput,
  deleteContentsOutput,
  listContentsInput,
  listContentsOutput,
} from "../services/contents";
import type { ContentsInputDoc, ContentsOutputDoc } from "../types";

type Tab = "input" | "output";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

const tabButtonClass = (active: boolean) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    active
      ? "bg-blue-600 text-white"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
  }`;

function BodyToggle({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {open ? "본문 닫기" : "본문 보기"}
      </button>
      {open && (
        <pre className="mt-2 max-h-80 overflow-auto rounded-md bg-gray-50 p-3 text-sm whitespace-pre-wrap dark:bg-gray-900">
          {body}
        </pre>
      )}
    </div>
  );
}

function ContentsInputPanel() {
  const [items, setItems] = useState<ContentsInputDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("");
  const [category, setCategory] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    listContentsInput()
      .then(setItems)
      .catch(() => setError("콘텐츠 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const formats = useMemo(() => [...new Set(items.map((i) => i.tags.format).filter(Boolean))], [items]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.tags.category).filter(Boolean))], [items]);

  const shown = items.filter((item) => {
    if (format && item.tags.format !== format) return false;
    if (category && item.tags.category !== category) return false;
    if (grade && item.tags.performanceGrade !== grade) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [item.title, item.body, item.tags.keyMessage].some((x) => x.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색 (제목·본문·핵심 메시지)"
          aria-label="콘텐츠 검색"
          className={`${inputClass} min-w-[180px] flex-1`}
        />
        <select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="포맷 필터" className={inputClass}>
          <option value="">포맷 전체</option>
          {formats.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="카테고리 필터" className={inputClass}>
          <option value="">카테고리 전체</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="성과등급 필터" className={inputClass}>
          <option value="">성과등급 전체</option>
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중…</p>}
      {!loading && !error && shown.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          표시할 콘텐츠가 없습니다. Claude Code에서 <code>/ingest</code>로 올려 보세요.
        </p>
      )}

      <ul className="space-y-3">
        {shown.map((item) => (
          <li key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {item.title} <span className="text-xs text-gray-400">· {item.id}</span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                item.tags.format,
                item.tags.category,
                item.tags.targetAudience,
                item.tags.performanceGrade && `성과 ${item.tags.performanceGrade}`,
                item.views !== null && `조회수 ${item.views.toLocaleString()}`,
                item.tags.publishedAt,
              ]
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag as string}
                    className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            {item.tags.keyMessage && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.tags.keyMessage}</p>
            )}
            <BodyToggle body={item.body} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContentsOutputPanel() {
  const [items, setItems] = useState<ContentsOutputDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [sources, setSources] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = () =>
    listContentsOutput()
      .then(setItems)
      .catch(() => setError("결과물 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));

  const reload = () => {
    setLoading(true);
    void fetchItems();
  };

  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const sourceIds = sources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await createContentsOutput(title, type, sourceIds, body);
      setTitle("");
      setType("");
      setSources("");
      setBody("");
      setShowForm(false);
      reload();
    } catch {
      setError("결과물을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("삭제할까요?")) return;
    try {
      await deleteContentsOutput(id);
      reload();
    } catch {
      setError("삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-gray-500 dark:text-gray-400">
          /draft가 자동으로 저장하거나, 여기서 직접 추가할 수 있습니다.
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "작성 취소" : "직접 추가하기"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="제목"
            aria-label="결과물 제목"
            className={inputClass}
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            maxLength={60}
            placeholder="종류 (예: 스레드, 뉴스레터, 유튜브 대본, 블로그 글)"
            aria-label="결과물 종류"
            className={inputClass}
          />
          <input
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            placeholder="참고한 Input 문서 ID (쉼표로 구분, 예: script-01,script-03)"
            aria-label="참고 문서 ID"
            className={inputClass}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="결과물 내용"
            aria-label="결과물 내용"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting || !title.trim() || !body.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "저장 중…" : "저장"}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중…</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          저장된 결과물이 없습니다. Claude Code에서 <code>/draft</code>로 초고를 만들어 보세요.
        </p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="shrink-0 text-xs text-red-600 hover:underline dark:text-red-400"
              >
                삭제
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {item.type || "종류 없음"} · 참고: {item.sourceIds.join(", ") || "없음"} ·{" "}
              {(item.updatedAt ?? item.createdAt)?.toLocaleString("ko-KR") ?? ""}
            </p>
            <BodyToggle body={item.body} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContentsAdmin() {
  const [tab, setTab] = useState<Tab>("input");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setTab("input")} className={tabButtonClass(tab === "input")}>
          Contents Input
        </button>
        <button type="button" onClick={() => setTab("output")} className={tabButtonClass(tab === "output")}>
          Contents Output
        </button>
      </div>
      {tab === "input" ? <ContentsInputPanel /> : <ContentsOutputPanel />}
    </div>
  );
}

export function ContentsAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">콘텐츠 창고</h1>
      <AdminGate>
        <ContentsAdmin />
      </AdminGate>
    </div>
  );
}
