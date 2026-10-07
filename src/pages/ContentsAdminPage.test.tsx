// 콘텐츠 창고(Contents Input/Output) 관리자 페이지 테스트 (Firestore 서비스는 모킹)
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { AuthContext, type AuthContextValue } from "../context/authContextValue";
import { ADMIN_EMAIL } from "../lib/admin";
import { ContentsAdminPage } from "./ContentsAdminPage";
import * as contents from "../services/contents";

vi.mock("../services/contents", () => ({
  listContentsInput: vi.fn(),
  listContentsOutput: vi.fn(),
  createContentsOutput: vi.fn(),
  deleteContentsOutput: vi.fn(),
}));

const inputDoc = {
  id: "script-01",
  title: "현재완료 활용법",
  sourceUrl: null,
  tags: {
    category: "문법",
    format: "유튜브 대본",
    targetAudience: "초등학생",
    performanceGrade: "상",
    publishedAt: "2026-09-20",
    keyMessage: "현재완료는 경험을 말할 때 쓴다",
  },
  views: 3210,
  body: "본문 내용",
};

function renderAs(user: User | null) {
  const auth: AuthContextValue = {
    user,
    loading: false,
    error: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  };
  return render(
    <AuthContext.Provider value={auth}>
      <ContentsAdminPage />
    </AuthContext.Provider>,
  );
}

describe("콘텐츠 창고", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(contents.listContentsInput).mockResolvedValue([inputDoc]);
    vi.mocked(contents.listContentsOutput).mockResolvedValue([]);
  });

  it("로그인하지 않으면 로그인 버튼만 보인다", () => {
    renderAs(null);
    expect(screen.getByRole("button", { name: "Google 로그인" })).toBeInTheDocument();
    expect(contents.listContentsInput).not.toHaveBeenCalled();
  });

  it("관리자가 아닌 계정은 접근 권한이 없다는 안내를 본다", () => {
    const other = { uid: "u1", email: "someone@else.com", emailVerified: true } as unknown as User;
    renderAs(other);
    expect(screen.getByText(/접근 권한이 없습니다/)).toBeInTheDocument();
    expect(contents.listContentsInput).not.toHaveBeenCalled();
  });

  it("관리자 계정은 Contents Input 목록을 본다", async () => {
    const admin = { uid: "admin1", email: ADMIN_EMAIL, emailVerified: true } as unknown as User;
    renderAs(admin);
    expect(await screen.findByText("현재완료 활용법")).toBeInTheDocument();
    expect(screen.getByText("현재완료는 경험을 말할 때 쓴다")).toBeInTheDocument();
  });

  it("Output 탭으로 전환하면 결과물 추가 버튼이 보인다", async () => {
    const admin = { uid: "admin1", email: ADMIN_EMAIL, emailVerified: true } as unknown as User;
    const user = userEvent.setup();
    renderAs(admin);

    await screen.findByText("현재완료 활용법");
    await user.click(screen.getByRole("button", { name: "Contents Output" }));

    expect(await screen.findByText(/저장된 결과물이 없습니다/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "직접 추가하기" })).toBeInTheDocument();
  });
});
