// 학습 진도 전역 상태를 제공하는 Context + useReducer 프로바이더
import { useEffect, useReducer, type ReactNode } from "react";
import { loadProgress, saveProgress } from "../services/storage";
import { progressReducer } from "./progressReducer";
import { ProgressContext } from "./progressContextValue";

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadProgress);

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}
