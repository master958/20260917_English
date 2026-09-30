// 로컬(브라우저)과 원격(Firestore) 진도를 항목별로 병합하는 순수 함수
import type { ProgressState, WrongAnswerEntry } from "../types";
import { CURRENT_SCHEMA_VERSION } from "./storage";

function mergeByLatest<T extends { lastAttemptedAt: string }>(
  local: Record<string, T>,
  remote: Record<string, T>,
): Record<string, T> {
  const merged: Record<string, T> = { ...remote };
  for (const [id, entry] of Object.entries(local)) {
    const other = merged[id];
    if (!other || entry.lastAttemptedAt > other.lastAttemptedAt) {
      merged[id] = entry;
    }
  }
  return merged;
}

function mergeWrongAnswers(
  local: WrongAnswerEntry[],
  remote: WrongAnswerEntry[],
): WrongAnswerEntry[] {
  const byId = new Map<string, WrongAnswerEntry>();
  for (const entry of [...remote, ...local]) {
    const other = byId.get(entry.questionId);
    if (!other || entry.recordedAt > other.recordedAt) {
      byId.set(entry.questionId, entry);
    }
  }
  return [...byId.values()];
}

// 카테고리/지문별로 더 최근에 푼 기록을 남기고, 오답은 문제 ID 기준으로 합친다.
export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    grammar: mergeByLatest(local.grammar, remote.grammar ?? {}),
    reading: mergeByLatest(local.reading, remote.reading ?? {}),
    wrongAnswers: mergeWrongAnswers(local.wrongAnswers, remote.wrongAnswers ?? []),
  };
}
