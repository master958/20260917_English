// AI 영어 선생님 채팅 화면: API 키 입력 → 대화 → 오류 표시 흐름 테스트
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPage } from "./ChatPage";

describe("ChatPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API 키가 없으면 키 입력 폼을 보여주고, 저장하면 채팅 화면으로 전환한다", async () => {
    render(<ChatPage />);
    await userEvent.type(screen.getByLabelText("Gemini API 키"), "test-key");
    await userEvent.click(screen.getByRole("button", { name: "저장하고 시작하기" }));
    expect(screen.getByLabelText("메시지 입력")).toBeInTheDocument();
    expect(localStorage.getItem("english-app-gemini-api-key")).toBe("test-key");
  });

  it("메시지를 보내면 지정 모델로 요청하고 응답을 표시한다", async () => {
    localStorage.setItem("english-app-gemini-api-key", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "Nice sentence!" }] } }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatPage />);
    await userEvent.type(screen.getByLabelText("메시지 입력"), "I goed home");
    await userEvent.click(screen.getByRole("button", { name: "전송" }));

    expect(await screen.findByText("Nice sentence!")).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("gemini-3.5-flash-lite:generateContent");
    expect(init.headers["x-goog-api-key"]).toBe("test-key");
  });

  it("API 오류 메시지를 화면에 표시한다", async () => {
    localStorage.setItem("english-app-gemini-api-key", "bad");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: "API key not valid" } }),
      }),
    );

    render(<ChatPage />);
    await userEvent.type(screen.getByLabelText("메시지 입력"), "hi");
    await userEvent.click(screen.getByRole("button", { name: "전송" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("API key not valid");
  });
});
