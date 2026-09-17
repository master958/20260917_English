// 전체 학습 진도 요약과 최근 학습 내역을 보여주는 메인 화면
import { Link } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { ProgressBar } from "../components/ProgressBar";
import { grammarCategories } from "../data/grammar";
import { readingPassages } from "../data/reading";

function findTitle(type: "grammar" | "reading", id: string): string {
  if (type === "grammar") {
    return grammarCategories.find((category) => category.id === id)?.title ?? id;
  }
  return readingPassages.find((passage) => passage.id === id)?.title ?? id;
}

export function HomePage() {
  const { summary, state } = useProgress();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-gray-900">학습 진도</h1>
        <p className="mt-1 text-sm text-gray-600">
          {summary.completedItems} / {summary.totalItems} 완료
        </p>
        <div className="mt-3">
          <ProgressBar percentage={summary.completionRate} />
        </div>
        <p className="mt-1 text-sm text-gray-500">{summary.completionRate}% 완료</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/grammar"
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">문법 연습</h2>
          <p className="mt-1 text-sm text-gray-600">시제, 관계대명사 등 문법 카테고리 학습</p>
        </Link>
        <Link
          to="/reading"
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">독해 연습</h2>
          <p className="mt-1 text-sm text-gray-600">난이도별 지문 읽기와 이해도 확인</p>
        </Link>
      </section>

      {state.wrongAnswers.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            오답노트에 <strong>{state.wrongAnswers.length}개</strong>의 문제가 있습니다.{" "}
            <Link to="/wrong-answers" className="underline">
              복습하러 가기
            </Link>
          </p>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gray-900">최근 학습</h2>
        {summary.recent.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">아직 학습 기록이 없습니다.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {summary.recent.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                [{item.type === "grammar" ? "문법" : "독해"}] {findTitle(item.type, item.id)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
