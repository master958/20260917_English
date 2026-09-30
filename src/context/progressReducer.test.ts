// 진도 리듀서(progressReducer)의 상태 전이 유닛 테스트
import { describe, expect, it } from "vitest";
import { progressReducer } from "./progressReducer";
import { createInitialProgressState } from "../services/storage";
import type { WrongAnswerEntry } from "../types";

describe("progressReducer", () => {
  it("SUBMIT_GRAMMAR_QUIZ는 카테고리 진도와 오답노트를 갱신한다", () => {
    const initial = createInitialProgressState();
    const wrongAnswers: WrongAnswerEntry[] = [
      {
        questionId: "q1",
        categoryId: "tenses",
        prompt: "Q1",
        choices: ["a", "b"],
        answerIndex: 1,
        explanation: "설명",
        selectedIndex: 0,
        recordedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const next = progressReducer(initial, {
      type: "SUBMIT_GRAMMAR_QUIZ",
      payload: { categoryId: "tenses", correctCount: 3, totalCount: 4, wrongAnswers },
    });

    expect(next.grammar["tenses"].completed).toBe(true);
    expect(next.grammar["tenses"].correctCount).toBe(3);
    expect(next.wrongAnswers).toHaveLength(1);
    expect(next.wrongAnswers[0].questionId).toBe("q1");
  });

  it("같은 문제를 다시 맞히면 오답노트에서 제거된다", () => {
    const initial = createInitialProgressState();
    const wrongAnswer: WrongAnswerEntry = {
      questionId: "q1",
      categoryId: "tenses",
      prompt: "Q1",
      choices: ["a", "b"],
      answerIndex: 1,
      explanation: "설명",
      selectedIndex: 0,
      recordedAt: "2026-01-01T00:00:00.000Z",
    };
    const withWrongAnswer = progressReducer(initial, {
      type: "SUBMIT_GRAMMAR_QUIZ",
      payload: {
        categoryId: "tenses",
        correctCount: 0,
        totalCount: 1,
        wrongAnswers: [wrongAnswer],
      },
    });

    const resubmitted = progressReducer(withWrongAnswer, {
      type: "SUBMIT_GRAMMAR_QUIZ",
      payload: { categoryId: "tenses", correctCount: 1, totalCount: 1, wrongAnswers: [] },
    });

    expect(resubmitted.wrongAnswers).toHaveLength(0);
  });

  it("REMOVE_WRONG_ANSWER는 지정한 문제를 오답노트에서 제거한다", () => {
    const initial = createInitialProgressState();
    initial.wrongAnswers.push({
      questionId: "q1",
      categoryId: "tenses",
      prompt: "Q1",
      choices: ["a", "b"],
      answerIndex: 1,
      explanation: "설명",
      selectedIndex: 0,
      recordedAt: "2026-01-01T00:00:00.000Z",
    });

    const next = progressReducer(initial, {
      type: "REMOVE_WRONG_ANSWER",
      payload: { questionId: "q1" },
    });

    expect(next.wrongAnswers).toHaveLength(0);
  });

  it("SUBMIT_READING_QUIZ는 지문 진도를 갱신한다", () => {
    const initial = createInitialProgressState();
    const next = progressReducer(initial, {
      type: "SUBMIT_READING_QUIZ",
      payload: { passageId: "daily-routine", correctCount: 2, totalCount: 3 },
    });

    expect(next.reading["daily-routine"]).toMatchObject({
      completed: true,
      correctCount: 2,
      totalCount: 3,
    });
  });
});
