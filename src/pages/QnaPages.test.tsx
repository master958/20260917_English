// 질문 게시판 목록/상세 페이지 컴포넌트 테스트 (Firestore 서비스는 모킹)
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { User } from "firebase/auth";
import { AuthContext, type AuthContextValue } from "../context/authContextValue";
import { QnaListPage } from "./QnaListPage";
import { QnaDetailPage } from "./QnaDetailPage";
import * as board from "../services/board";

vi.mock("../services/board", () => ({
  QUESTION_TITLE_MAX: 100,
  QUESTION_CONTENT_MAX: 2000,
  ANSWER_CONTENT_MAX: 1000,
  listQuestions: vi.fn(),
  getQuestion: vi.fn(),
  createQuestion: vi.fn(),
  deleteQuestion: vi.fn(),
  listAnswers: vi.fn(),
  createAnswer: vi.fn(),
  deleteAnswer: vi.fn(),
}));

const me = { uid: "u1", displayName: "철수", email: null, photoURL: null } as unknown as User;

const question = {
  id: "q1",
  title: "현재완료와 과거시제 차이",
  content: "언제 have p.p.를 쓰나요?",
  authorId: "u1",
  authorName: "철수",
  authorPhoto: null,
  answerCount: 1,
  createdAt: new Date("2026-09-20T10:00:00"),
};

function renderAt(path: string, user: User | null) {
  const auth: AuthContextValue = {
    user,
    loading: false,
    error: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  };
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/qna" element={<QnaListPage />} />
          <Route path="/qna/:questionId" element={<QnaDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("질문 게시판", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(board.listQuestions).mockResolvedValue({ questions: [question], nextCursor: null });
    vi.mocked(board.getQuestion).mockResolvedValue(question);
    vi.mocked(board.listAnswers).mockResolvedValue([]);
  });

  it("목록에 질문 제목과 답변 수가 표시된다", async () => {
    renderAt("/qna", null);
    expect(await screen.findByText("현재완료와 과거시제 차이")).toBeInTheDocument();
    expect(screen.getByText("답변 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인하고 질문하기" })).toBeInTheDocument();
  });

  it("로그인 사용자가 질문을 등록하면 상세 페이지로 이동한다", async () => {
    vi.mocked(board.createQuestion).mockResolvedValue("q1");
    const user = userEvent.setup();
    renderAt("/qna", me);

    await user.click(await screen.findByRole("button", { name: "질문하기" }));
    await user.type(screen.getByLabelText("질문 제목"), "새 질문");
    await user.type(screen.getByLabelText("질문 내용"), "내용입니다");
    await user.click(screen.getByRole("button", { name: "등록" }));

    expect(board.createQuestion).toHaveBeenCalledWith(me, "새 질문", "내용입니다");
    expect(await screen.findByText("언제 have p.p.를 쓰나요?")).toBeInTheDocument();
  });

  it("상세 페이지에서 답변을 등록하면 목록을 다시 불러온다", async () => {
    vi.mocked(board.createAnswer).mockResolvedValue();
    const user = userEvent.setup();
    renderAt("/qna/q1", me);

    await user.type(await screen.findByLabelText("답변 내용"), "경험을 말할 때 써요");
    await user.click(screen.getByRole("button", { name: "답변 등록" }));

    expect(board.createAnswer).toHaveBeenCalledWith(me, "q1", "경험을 말할 때 써요");
    expect(board.listAnswers).toHaveBeenCalledTimes(2);
  });

  it("작성자가 아니면 삭제 버튼이 보이지 않는다", async () => {
    renderAt("/qna/q1", { ...me, uid: "someone-else" } as User);
    expect(await screen.findByText("현재완료와 과거시제 차이")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
  });
});
