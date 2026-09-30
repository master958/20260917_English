// AI 영어 선생님 채팅 화면: API 키 입력 → 대화 → 오류 표시 흐름 테스트
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ChatPage } from "./ChatPage";

const renderChat = (state?: unknown) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/chat", state }]}>
      <ChatPage />
    </MemoryRouter>,
  );

describe("ChatPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API 키가 없으면 키 입력 폼을 보여주고, 저장하면 채팅 화면으로 전환한다", async () => {
    renderChat();
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

    renderChat();
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

    renderChat();
    await userEvent.type(screen.getByLabelText("메시지 입력"), "hi");
    await userEvent.click(screen.getByRole("button", { name: "전송" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("API key not valid");
  });

  it("오답노트에서 넘어온 질문은 키가 있으면 자동으로 전송한다", async () => {
    localStorage.setItem("english-app-gemini-api-key", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "설명입니다" }] } }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderChat({ initialPrompt: "이 문제를 설명해 주세요" });

    expect(await screen.findByText("설명입니다")).toBeInTheDocument();
    expect(screen.getByText("이 문제를 설명해 주세요")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("빠른 답변 칩을 누르면 그 문장이 바로 전송된다", async () => {
    localStorage.setItem("english-app-gemini-api-key", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "답변" }] } }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    await userEvent.click(screen.getByRole("button", { name: "오늘의 영어 표현 알려줘" }));
    await screen.findByText("답변");
    await userEvent.click(screen.getByRole("button", { name: "더 쉽게 설명해줘" }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.contents).toHaveLength(3);
    expect(body.contents[2].parts[0].text).toBe("더 쉽게 설명해줘");
  });

  it("선생님 답변의 마크다운을 렌더링한다", async () => {
    localStorage.setItem("english-app-gemini-api-key", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "**went**가 맞아요\n\n* 하나\n* 둘" }] } }],
        }),
      }),
    );

    renderChat();
    await userEvent.type(screen.getByLabelText("메시지 입력"), "hi");
    await userEvent.click(screen.getByRole("button", { name: "전송" }));

    expect((await screen.findByText("went")).tagName).toBe("STRONG");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
