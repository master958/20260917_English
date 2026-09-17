// 난이도별 독해 지문 목록을 보여주는 페이지 컴포넌트
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReadingPassages } from "../services/content";
import { useProgress } from "../hooks/useProgress";
import type { ReadingLevel, ReadingPassage } from "../types";

const levelLabels: Record<ReadingLevel, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function ReadingListPage() {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [levelFilter, setLevelFilter] = useState<ReadingLevel | "all">("all");
  const { state } = useProgress();

  useEffect(() => {
    getReadingPassages().then(setPassages);
  }, []);

  const filteredPassages = passages.filter(
    (passage) => levelFilter === "all" || passage.level === levelFilter,
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">독해 지문</h1>
      <div className="flex gap-2">
        {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setLevelFilter(level)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              levelFilter === level
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-700`}
          >
            {level === "all" ? "전체" : levelLabels[level]}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {filteredPassages.map((passage) => {
          const progress = state.reading[passage.id];
          return (
            <li key={passage.id}>
              <Link
                to={`/reading/${passage.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {passage.title}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {levelLabels[passage.level]}
                  </span>
                </div>
                {progress?.completed && (
                  <p className="mt-1 text-xs font-medium text-green-700 dark:text-green-400">
                    완료 {progress.correctCount}/{progress.totalCount}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
