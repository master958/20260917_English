// 로그인한 사용자가 콘텐츠 스튜디오 관리자 계정인지 확인하는 훅
import { ADMIN_EMAIL } from "../lib/admin";
import { useAuth } from "./useAuth";

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);
}
