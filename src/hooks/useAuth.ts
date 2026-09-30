// 로그인 상태와 구글 로그인/로그아웃 함수를 제공하는 커스텀 훅
import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
