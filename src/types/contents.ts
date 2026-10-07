// Contents Input/Output 관리자 페이지 타입 정의
// 콘텐츠 스튜디오 저장소(260927contents)의 scripts/upload.mjs · scripts/save-output.mjs가 쓰는 문서 구조와 맞춘다.

export interface ContentsInputTags {
  category: string;
  format: string;
  targetAudience: string;
  performanceGrade: string;
  publishedAt: string;
  keyMessage: string;
}

export interface ContentsInputDoc {
  id: string;
  title: string;
  sourceUrl: string | null;
  tags: ContentsInputTags;
  views: number | null;
  body: string;
}

export interface ContentsOutputDoc {
  id: string;
  title: string;
  type: string;
  sourceIds: string[];
  body: string;
  meta: Record<string, unknown> | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
