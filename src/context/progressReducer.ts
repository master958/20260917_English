// 진도 상태를 갱신하는 리듀서와 액션 타입 정의
import type { ProgressState, WrongAnswerEntry } from "../types";

export type ProgressAction =
  | {
      type: "SUBMIT_GRAMMAR_QUIZ";
      payload: {
        categoryId: string;
        correctCount: number;
        totalCount: number;
        wrongAnswers: WrongAnswerEntry[];
      };
    }
  | {
      type: "SUBMIT_READING_QUIZ";
      payload: { passageId: string; correctCount: number; totalCount: number };
    }
  | { type: "REMOVE_WRONG_ANSWER"; payload: { questionId: string } }
  | { type: "RESET_PROGRESS" };

export function progressReducer(
  state: ProgressState,
  action: ProgressAction,
): ProgressState {
  switch (action.type) {
    case "SUBMIT_GRAMMAR_QUIZ": {
      const { categoryId, correctCount, totalCount, wrongAnswers } = action.payload;
      const remainingWrongAnswers = state.wrongAnswers.filter(
        (entry) => entry.categoryId !== categoryId,
      );
      return {
        ...state,
        grammar: {
          ...state.grammar,
          [categoryId]: {
            completed: true,
            correctCount,
            totalCount,
            lastAttemptedAt: new Date().toISOString(),
          },
        },
        wrongAnswers: [...remainingWrongAnswers, ...wrongAnswers],
      };
    }
    case "SUBMIT_READING_QUIZ": {
      const { passageId, correctCount, totalCount } = action.payload;
      return {
        ...state,
        reading: {
          ...state.reading,
          [passageId]: {
            completed: true,
            correctCount,
            totalCount,
            lastAttemptedAt: new Date().toISOString(),
          },
        },
      };
    }
    case "REMOVE_WRONG_ANSWER": {
      return {
        ...state,
        wrongAnswers: state.wrongAnswers.filter(
          (entry) => entry.questionId !== action.payload.questionId,
        ),
      };
    }
    case "RESET_PROGRESS": {
      return {
        schemaVersion: state.schemaVersion,
        grammar: {},
        reading: {},
        wrongAnswers: [],
      };
    }
    default:
      return state;
  }
}
