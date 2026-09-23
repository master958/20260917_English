// 진도 상태를 읽고 갱신하는 커스텀 훅
import { useContext, useMemo } from "react";
import { ProgressContext } from "../context/progressContextValue";
import type { WrongAnswerEntry } from "../types";
import { grammarCategories } from "../data/grammar";
import { readingPassages } from "../data/reading";

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress는 ProgressProvider 내부에서만 사용할 수 있습니다.");
  }
  const { state, dispatch, syncStatus } = context;

  const submitGrammarQuiz = (
    categoryId: string,
    correctCount: number,
    totalCount: number,
    wrongAnswers: WrongAnswerEntry[],
  ) => {
    dispatch({
      type: "SUBMIT_GRAMMAR_QUIZ",
      payload: { categoryId, correctCount, totalCount, wrongAnswers },
    });
  };

  const submitReadingQuiz = (
    passageId: string,
    correctCount: number,
    totalCount: number,
  ) => {
    dispatch({
      type: "SUBMIT_READING_QUIZ",
      payload: { passageId, correctCount, totalCount },
    });
  };

  const removeWrongAnswer = (questionId: string) => {
    dispatch({ type: "REMOVE_WRONG_ANSWER", payload: { questionId } });
  };

  const resetProgress = () => {
    dispatch({ type: "RESET_PROGRESS" });
  };

  const summary = useMemo(() => {
    const totalItems = grammarCategories.length + readingPassages.length;
    const completedGrammar = Object.values(state.grammar).filter(
      (item) => item.completed,
    ).length;
    const completedReading = Object.values(state.reading).filter(
      (item) => item.completed,
    ).length;
    const completedItems = completedGrammar + completedReading;
    const completionRate =
      totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    const lastAttempts = [
      ...Object.entries(state.grammar).map(([id, entry]) => ({
        id,
        type: "grammar" as const,
        lastAttemptedAt: entry.lastAttemptedAt,
      })),
      ...Object.entries(state.reading).map(([id, entry]) => ({
        id,
        type: "reading" as const,
        lastAttemptedAt: entry.lastAttemptedAt,
      })),
    ].sort((a, b) => b.lastAttemptedAt.localeCompare(a.lastAttemptedAt));

    return {
      completionRate,
      completedItems,
      totalItems,
      recent: lastAttempts.slice(0, 5),
    };
  }, [state.grammar, state.reading]);

  return {
    state,
    syncStatus,
    summary,
    submitGrammarQuiz,
    submitReadingQuiz,
    removeWrongAnswer,
    resetProgress,
  };
}
