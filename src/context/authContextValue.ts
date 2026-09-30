// AuthContext 인스턴스 정의 (컴포넌트 파일과 분리하여 Fast Refresh 호환성을 유지)
import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
