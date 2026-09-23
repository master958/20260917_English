// 질문 게시판(Q&A) 관련 타입 정의

export interface BoardAuthor {
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
}

export interface BoardQuestion extends BoardAuthor {
  id: string;
  title: string;
  content: string;
  answerCount: number;
  createdAt: Date | null;
}

export interface BoardAnswer extends BoardAuthor {
  id: string;
  content: string;
  createdAt: Date | null;
}
