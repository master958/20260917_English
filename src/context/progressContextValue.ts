// ProgressContext 인스턴스 정의 (컴포넌트 파일과 분리하여 Fast Refresh 호환성을 유지)
import { createContext, type Dispatch } from "react";
import type { ProgressState } from "../types";
import type { ProgressAction } from "./progressReducer";

// offline: 비로그인(로컬 저장만), syncing/synced/error: Firestore 동기화 상태
export type SyncStatus = "offline" | "syncing" | "synced" | "error";

export interface ProgressContextValue {
  state: ProgressState;
  dispatch: Dispatch<ProgressAction>;
  syncStatus: SyncStatus;
}

export const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined,
);
