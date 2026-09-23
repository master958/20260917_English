// 문법 카테고리 퀴즈 풀이 전체 흐름에 대한 컴포넌트 테스트
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "../context/ProgressContext";
import { GrammarCategoryPage } from "./GrammarCategoryPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/grammar/tenses"]}>
      <ProgressProvider>
        <Routes>
          <Route path="/grammar/:categoryId" element={<GrammarCategoryPage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  );
}

describe("GrammarCategoryPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("모든 문제를 맞히면 4/4 결과가 표시된다", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("시제 (Tenses)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "have finished" }));
    await user.click(screen.getByRole("button", { name: "rises" }));
    await user.click(screen.getByRole("button", { name: "went" }));
    await user.click(screen.getByRole("button", { name: "have known" }));

    await user.click(screen.getByRole("button", { name: "채점하기" }));

    expect(await screen.findByText("결과: 4 / 4개 정답")).toBeInTheDocument();
  });

  it("오답을 선택하면 해설이 보인다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("시제 (Tenses)");

    await user.click(screen.getByRole("button", { name: "finish" }));
    await user.click(screen.getByRole("button", { name: "rises" }));
    await user.click(screen.getByRole("button", { name: "went" }));
    await user.click(screen.getByRole("button", { name: "have known" }));

    await user.click(screen.getByRole("button", { name: "채점하기" }));

    expect(await screen.findByText("결과: 3 / 4개 정답")).toBeInTheDocument();
    expect(
      screen.getByText(
        "현재까지 완료되어 지금 상태에 영향을 주는 일이므로 현재완료 'have finished'가 적절합니다.",
      ),
    ).toBeInTheDocument();
  });
});
