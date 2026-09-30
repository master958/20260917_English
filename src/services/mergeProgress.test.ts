// 로컬/원격 진도 병합 로직에 대한 유닛 테스트
import { describe, expect, it } from "vitest";
import { mergeProgress } from "./mergeProgress";
import { createInitialProgressState } from "./storage";
import type { WrongAnswerEntry } from "../types";

function wrong(questionId: string, recordedAt: string): WrongAnswerEntry {
  return {
    questionId,
    categoryId: "tenses",
    prompt: "",
    choices: [],
    answerIndex: 0,
    explanation: "",
    selectedIndex: 1,
    recordedAt,
  };
}

describe("mergeProgress", () => {
  it("같은 카테고리는 더 최근에 푼 기록을 남긴다", () => {
    const local = createInitialProgressState();
    const remote = createInitialProgressState();
    local.grammar.tenses = { completed: true, correctCount: 5, totalCount: 5, lastAttemptedAt: "2026-09-02" };
    remote.grammar.tenses = { completed: true, correctCount: 1, totalCount: 5, lastAttemptedAt: "2026-09-01" };
    remote.reading.story = { completed: true, correctCount: 2, totalCount: 3, lastAttemptedAt: "2026-09-01" };

    const merged = mergeProgress(local, remote);

    expect(merged.grammar.tenses.correctCount).toBe(5);
    expect(merged.reading.story.correctCount).toBe(2);
  });

  it("오답은 문제 ID 기준으로 합쳐 중복을 제거한다", () => {
    const local = { ...createInitialProgressState(), wrongAnswers: [wrong("q1", "2026-09-02"), wrong("q2", "2026-09-02")] };
    const remote = { ...createInitialProgressState(), wrongAnswers: [wrong("q1", "2026-09-01"), wrong("q3", "2026-09-01")] };

    const merged = mergeProgress(local, remote);

    expect(merged.wrongAnswers.map((entry) => entry.questionId).sort()).toEqual(["q1", "q2", "q3"]);
    expect(merged.wrongAnswers.find((entry) => entry.questionId === "q1")?.recordedAt).toBe("2026-09-02");
  });
});
