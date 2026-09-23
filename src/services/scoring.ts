// 퀴즈 채점 및 정답률 계산 로직
import type { GrammarQuestion, ComprehensionQuestion } from "../types";

export interface GradeResult {
  correctCount: number;
  totalCount: number;
  wrongQuestionIds: string[];
}

export function gradeQuiz(
  questions: (GrammarQuestion | ComprehensionQuestion)[],
  selectedIndexes: Record<string, number>,
): GradeResult {
  let correctCount = 0;
  const wrongQuestionIds: string[] = [];

  for (const question of questions) {
    const selected = selectedIndexes[question.id];
    if (selected === question.answerIndex) {
      correctCount += 1;
    } else {
      wrongQuestionIds.push(question.id);
    }
  }

  return {
    correctCount,
    totalCount: questions.length,
    wrongQuestionIds,
  };
}

export function calculateAccuracy(correctCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return 0;
  }
  return Math.round((correctCount / totalCount) * 100);
}
