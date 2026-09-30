// 독해 지문 읽기 및 이해도 퀴즈 풀이 흐름에 대한 컴포넌트 테스트
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "../context/ProgressContext";
import { ReadingPassagePage } from "./ReadingPassagePage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/reading/daily-routine"]}>
      <ProgressProvider>
        <Routes>
          <Route path="/reading/:passageId" element={<ReadingPassagePage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  );
}

describe("ReadingPassagePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("단어를 클릭하면 뜻 팝업이 표시된다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("My Daily Routine");

    await user.click(screen.getByRole("button", { name: "commute" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("통근하다, 통근");
  });

  it("이해도 문제를 모두 맞히면 결과가 표시된다", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText("My Daily Routine");

    await user.click(screen.getByRole("button", { name: "By bus" }));
    await user.click(screen.getByRole("button", { name: "Thirty minutes" }));
    await user.click(screen.getByRole("button", { name: "Goes to the grocery store" }));

    await user.click(screen.getByRole("button", { name: "채점하기" }));

    expect(await screen.findByText("결과: 3 / 3개 정답")).toBeInTheDocument();
  });
});
