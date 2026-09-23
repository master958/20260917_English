// localStorage 저장/불러오기 및 스키마 마이그레이션 유닛 테스트
import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, saveProgress, createInitialProgressState } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("저장된 값이 없으면 초기 상태를 반환한다", () => {
    const state = loadProgress();
    expect(state).toEqual(createInitialProgressState());
  });

  it("저장한 값을 그대로 불러온다", () => {
    const state = createInitialProgressState();
    state.grammar["tenses"] = {
      completed: true,
      correctCount: 3,
      totalCount: 4,
      lastAttemptedAt: "2026-01-01T00:00:00.000Z",
    };
    saveProgress(state);

    const loaded = loadProgress();
    expect(loaded.grammar["tenses"]).toEqual(state.grammar["tenses"]);
    expect(loaded.schemaVersion).toBe(state.schemaVersion);
  });

  it("손상된 JSON이 저장되어 있으면 초기 상태로 복구한다", () => {
    localStorage.setItem("english-app-progress", "{ not valid json");
    const loaded = loadProgress();
    expect(loaded).toEqual(createInitialProgressState());
  });

  it("스키마 버전이 다르면 현재 버전으로 마이그레이션한다", () => {
    localStorage.setItem(
      "english-app-progress",
      JSON.stringify({ schemaVersion: 0, grammar: {}, reading: {}, wrongAnswers: [] }),
    );
    const loaded = loadProgress();
    expect(loaded.schemaVersion).toBe(createInitialProgressState().schemaVersion);
  });
});
