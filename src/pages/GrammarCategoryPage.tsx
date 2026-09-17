// 문법 카테고리 상세: 규칙 설명, 예문, 퀴즈를 보여주는 페이지 컴포넌트
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGrammarCategory } from "../services/content";
import { useProgress } from "../hooks/useProgress";
import { QuizRunner, type QuizCompleteResult } from "../components/QuizRunner";
import type { GrammarCategory, WrongAnswerEntry } from "../types";

export function GrammarCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<GrammarCategory | null | undefined>(undefined);
  const [result, setResult] = useState<{ correctCount: number; totalCount: number } | null>(
    null,
  );
  const { submitGrammarQuiz } = useProgress();

  useEffect(() => {
    if (!categoryId) return;
    getGrammarCategory(categoryId).then((found) => setCategory(found ?? null));
  }, [categoryId]);

  if (category === undefined) {
    return <p className="text-gray-500 dark:text-gray-400">불러오는 중...</p>;
  }

  if (category === null || !categoryId) {
    return <p className="text-gray-500 dark:text-gray-400">카테고리를 찾을 수 없습니다.</p>;
  }

  const handleComplete = (quizResult: QuizCompleteResult) => {
    const wrongAnswers: WrongAnswerEntry[] = category.questions
      .filter((question) => quizResult.selections[question.id] !== question.answerIndex)
      .map((question) => ({
        questionId: question.id,
        categoryId: category.id,
        prompt: question.prompt,
        choices: question.choices,
        answerIndex: question.answerIndex,
        explanation: question.explanation,
        selectedIndex: quizResult.selections[question.id],
        recordedAt: new Date().toISOString(),
      }));

    submitGrammarQuiz(
      category.id,
      quizResult.correctCount,
      quizResult.totalCount,
      wrongAnswers,
    );
    setResult({ correctCount: quizResult.correctCount, totalCount: quizResult.totalCount });
  };

  return (
    <div className="space-y-6">
      <Link to="/grammar" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← 문법 목록으로
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.title}</h1>

      <section className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">규칙 설명</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {category.ruleExplanation}
        </p>
        <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">예문</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {category.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">퀴즈</h2>
        {result && (
          <p className="mb-4 rounded-md bg-blue-50 p-3 text-sm font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            결과: {result.correctCount} / {result.totalCount}개 정답
          </p>
        )}
        <QuizRunner questions={category.questions} onComplete={handleComplete} />
      </section>
    </div>
  );
}
