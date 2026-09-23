// 헤더에 표시되는 구글 로그인/로그아웃 버튼과 동기화 상태 표시
import { useAuth } from "../hooks/useAuth";
import { useProgress } from "../hooks/useProgress";

const syncLabel = {
  offline: "",
  syncing: "동기화 중…",
  synced: "☁️ 저장됨",
  error: "⚠️ 동기화 실패",
} as const;

const buttonClass =
  "rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";

export function AuthButton() {
  const { user, loading, error, signInWithGoogle, signOut } = useAuth();
  const { syncStatus } = useProgress();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
        <button type="button" onClick={signInWithGoogle} className={buttonClass}>
          구글 로그인
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">
        {syncLabel[syncStatus]}
      </span>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          className="h-8 w-8 rounded-full"
        />
      )}
      <span className="hidden text-sm text-gray-700 md:inline dark:text-gray-200">
        {user.displayName ?? user.email}
      </span>
      <button type="button" onClick={signOut} className={buttonClass}>
        로그아웃
      </button>
    </div>
  );
}
