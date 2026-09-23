// localStorage에 학습 진도를 저장/불러오는 서비스 (버전 필드 기반 마이그레이션 지원)
import type { ProgressState } from "../types";

const STORAGE_KEY = "english-app-progress";
export const CURRENT_SCHEMA_VERSION = 1;

export function createInitialProgressState(): ProgressState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    grammar: {},
    reading: {},
    wrongAnswers: [],
  };
}

function migrateProgressState(state: ProgressState): ProgressState {
  // 향후 스키마 버전이 올라갈 때 이 함수에 단계별 마이그레이션을 추가한다.
  if (state.schemaVersion === CURRENT_SCHEMA_VERSION) {
    return state;
  }
  return { ...createInitialProgressState(), ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialProgressState();
    }
    const parsed = JSON.parse(raw) as ProgressState;
    return migrateProgressState(parsed);
  } catch {
    return createInitialProgressState();
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
