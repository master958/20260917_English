// 게시판 글 작성자 프로필 사진·이름·작성 시각 표시
import type { BoardAuthor } from "../types";

function formatBoardDate(date: Date | null): string {
  return date ? date.toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" }) : "방금 전";
}

export function AuthorBadge({ author, createdAt }: { author: BoardAuthor; createdAt: Date | null }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      {author.authorPhoto && (
        <img src={author.authorPhoto} alt="" referrerPolicy="no-referrer" className="h-5 w-5 rounded-full" />
      )}
      <span className="font-medium text-gray-700 dark:text-gray-300">{author.authorName}</span>
      <span>·</span>
      <span>{formatBoardDate(createdAt)}</span>
    </div>
  );
}
