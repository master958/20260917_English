// 채점 로직(gradeQuiz, calculateAccuracy) 유닛 테스트
import { describe, expect, it } from "vitest";
import { gradeQuiz, calculateAccuracy } from "./scoring";
import type { GrammarQuestion } from "../types";

const questions: GrammarQuestion[] = [
  {
    id: "q1",
    prompt: "Q1",
    choices: ["a", "b", "c"],
    answerIndex: 1,
    explanation: "b가 정답",
  },
  {
    id: "q2",
    prompt: "Q2",
    choices: ["a", "b", "c"],
    answerIndex: 2,
    explanation: "c가 정답",
  },
];

describe("gradeQuiz", () => {
  it("모든 문제를 맞히면 correctCount가 전체 문제 수와 같다", () => {
    const result = gradeQuiz(questions, { q1: 1, q2: 2 });
    expect(result.correctCount).toBe(2);
    expect(result.totalCount).toBe(2);
    expect(result.wrongQuestionIds).toEqual([]);
  });

  it("틀린 문제의 id를 wrongQuestionIds에 담는다", () => {
    const result = gradeQuiz(questions, { q1: 0, q2: 2 });
    expect(result.correctCount).toBe(1);
    expect(result.wrongQuestionIds).toEqual(["q1"]);
  });

  it("응답하지 않은 문제는 오답으로 처리한다", () => {
    const result = gradeQuiz(questions, { q1: 1 });
    expect(result.correctCount).toBe(1);
    expect(result.wrongQuestionIds).toEqual(["q2"]);
  });
});

describe("calculateAccuracy", () => {
  it("정답률을 백분율 정수로 반환한다", () => {
    expect(calculateAccuracy(1, 3)).toBe(33);
    expect(calculateAccuracy(2, 4)).toBe(50);
  });

  it("전체 문제 수가 0이면 0을 반환한다", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });
});
