// 관리자 전용 페이지를 감싸는 접근 제어 컴포넌트. 실제 잠금은 firestore.rules(isAdmin)이 한다 — 여기서는 안내만 보여준다.
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useIsAdmin } from "../hooks/useAdmin";

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth();
  const isAdmin = useIsAdmin();

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">확인 중…</p>;
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <p className="text-gray-600 dark:text-gray-300">운영자만 볼 수 있는 공간입니다.</p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Google 로그인
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        이 계정({user.email})에는 접근 권한이 없습니다.
      </p>
    );
  }

  return <>{children}</>;
}
