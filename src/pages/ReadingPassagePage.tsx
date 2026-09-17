// 독해 지문 읽기 화면: 단어 뜻 팝업과 이해도 확인 퀴즈를 제공하는 페이지 컴포넌트
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReadingPassage, getDictionaryEntries } from "../services/content";
import { useProgress } from "../hooks/useProgress";
import { GlossaryText } from "../components/GlossaryText";
import { QuizRunner, type QuizCompleteResult } from "../components/QuizRunner";
import type { DictionaryEntry, ReadingPassage } from "../types";

export function ReadingPassagePage() {
  const { passageId } = useParams<{ passageId: string }>();
  const [passage, setPassage] = useState<ReadingPassage | null | undefined>(undefined);
  const [glossary, setGlossary] = useState<DictionaryEntry[]>([]);
  const [result, setResult] = useState<{ correctCount: number; totalCount: number } | null>(
    null,
  );
  const { submitReadingQuiz } = useProgress();

  useEffect(() => {
    if (!passageId) return;
    getReadingPassage(passageId).then((found) => {
      setPassage(found ?? null);
      if (found) {
        getDictionaryEntries(found.glossaryWordIds).then(setGlossary);
      }
    });
  }, [passageId]);

  if (passage === undefined) {
    return <p className="text-gray-500 dark:text-gray-400">불러오는 중...</p>;
  }

  if (passage === null) {
    return <p className="text-gray-500 dark:text-gray-400">지문을 찾을 수 없습니다.</p>;
  }

  const handleComplete = (quizResult: QuizCompleteResult) => {
    submitReadingQuiz(passage.id, quizResult.correctCount, quizResult.totalCount);
    setResult({ correctCount: quizResult.correctCount, totalCount: quizResult.totalCount });
  };

  return (
    <div className="space-y-6">
      <Link to="/reading" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← 독해 목록으로
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{passage.title}</h1>

      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <GlossaryText text={passage.body} glossary={glossary} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          이해도 확인 문제
        </h2>
        {result && (
          <p className="mb-4 rounded-md bg-blue-50 p-3 text-sm font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            결과: {result.correctCount} / {result.totalCount}개 정답
          </p>
        )}
        <QuizRunner questions={passage.questions} onComplete={handleComplete} />
      </section>
    </div>
  );
}
