// 학습 진도 전역 상태를 제공하는 Context + useReducer 프로바이더
// 로그인 상태이면 localStorage와 함께 Firestore(users/{uid})에도 진도를 동기화한다.
import { useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { loadProgress, saveProgress } from "../services/storage";
import { mergeProgress } from "../services/mergeProgress";
import { loadRemoteProgress, saveRemoteProgress } from "../services/remoteProgress";
import { progressReducer } from "./progressReducer";
import { ProgressContext, type SyncStatus } from "./progressContextValue";
import { AuthContext } from "./authContextValue";

const REMOTE_SAVE_DELAY_MS = 1500;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadProgress);
  // AuthProvider 밖(테스트 등)에서도 동작하도록 컨텍스트가 없으면 비로그인으로 취급한다.
  const uid = useContext(AuthContext)?.user?.uid ?? null;
  const [remoteStatus, setSyncStatus] = useState<Exclude<SyncStatus, "offline">>("syncing");
  const syncStatus: SyncStatus = uid ? remoteStatus : "offline";
  const hydratedUidRef = useRef<string | null>(null);
  const lastRemoteSavedRef = useRef<typeof state | null>(null);
  const stateRef = useRef(state);
  const prevUidRef = useRef<string | null>(uid);

  useEffect(() => {
    stateRef.current = state;
    saveProgress(state);
  }, [state]);

  // 로그인 직후: 원격 진도를 불러와 로컬 진도와 병합한다.
  useEffect(() => {
    hydratedUidRef.current = null;
    const prevUid = prevUidRef.current;
    prevUidRef.current = uid;
    if (!uid) {
      // 로그아웃하면 이 브라우저의 진도를 비워 다음 사용자에게 섞이지 않게 한다 (원격 데이터는 유지).
      if (prevUid) dispatch({ type: "RESET_PROGRESS" });
      return;
    }
    let cancelled = false;
    loadRemoteProgress(uid)
      .then((remote) => {
        if (cancelled) return;
        const merged = remote ? mergeProgress(stateRef.current, remote) : stateRef.current;
        hydratedUidRef.current = uid;
        lastRemoteSavedRef.current = merged;
        dispatch({ type: "HYDRATE", payload: merged });
        return saveRemoteProgress(uid, merged);
      })
      .then(() => {
        if (!cancelled) setSyncStatus("synced");
      })
      .catch(() => {
        if (!cancelled) setSyncStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // 진도가 바뀌면 잠시 모았다가 Firestore에 저장한다 (쓰기 횟수 절약).
  useEffect(() => {
    if (!uid || hydratedUidRef.current !== uid) return;
    if (lastRemoteSavedRef.current === state) return;
    const timer = setTimeout(() => {
      setSyncStatus("syncing");
      lastRemoteSavedRef.current = state;
      saveRemoteProgress(uid, state)
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("error"));
    }, REMOTE_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [uid, state]);

  return (
    <ProgressContext.Provider value={{ state, dispatch, syncStatus }}>
      {children}
    </ProgressContext.Provider>
  );
}
