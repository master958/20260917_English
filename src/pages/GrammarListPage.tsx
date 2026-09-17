// 문법 카테고리 목록을 보여주는 페이지 컴포넌트
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGrammarCategories } from "../services/content";
import { useProgress } from "../hooks/useProgress";
import type { GrammarCategory } from "../types";

export function GrammarListPage() {
  const [categories, setCategories] = useState<GrammarCategory[]>([]);
  const { state } = useProgress();

  useEffect(() => {
    getGrammarCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">문법 카테고리</h1>
      <ul className="space-y-3">
        {categories.map((category) => {
          const progress = state.grammar[category.id];
          return (
            <li key={category.id}>
              <Link
                to={`/grammar/${category.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">{category.title}</h2>
                  {progress?.completed && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      완료 {progress.correctCount}/{progress.totalCount}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{category.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
