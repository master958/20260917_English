// Gemini REST API로 영어 선생님 AI와 대화하는 서비스 (사용자가 입력한 API 키를 브라우저에서 직접 사용)
export const GEMINI_MODEL = "gemini-3.5-flash-lite";
const API_KEY_STORAGE_KEY = "english-app-gemini-api-key";

export type ChatRole = "user" | "model";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export const TEACHER_SYSTEM_PROMPT = [
  "You are a friendly, patient English teacher for Korean learners.",
  "Explain in Korean, and give English examples with Korean translations.",
  "If the student writes in English, gently correct grammar and word choice mistakes, showing the corrected sentence and a short reason.",
  "Keep answers concise and well organized, and end with a short follow-up question or practice prompt when useful.",
].join(" ");

export interface ExplainTarget {
  prompt: string;
  choices: string[];
  answerIndex: number;
  selectedIndex: number;
}

// 오답노트 문제를 AI 선생님에게 설명 요청하는 첫 메시지로 만든다.
export function buildExplainPrompt(target: ExplainTarget): string {
  const choices = target.choices.map((choice, index) => `${index + 1}. ${choice}`).join("\n");
  return [
    "다음 문제를 틀렸어요. 왜 정답이 맞고 내 답이 틀렸는지 쉽게 설명해 주세요.",
    "",
    `문제: ${target.prompt}`,
    choices,
    `정답: ${target.answerIndex + 1}번`,
    `내가 고른 답: ${target.selectedIndex + 1}번`,
  ].join("\n");
}

export function loadApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } catch {
    // 저장이 막힌 환경에서는 현재 세션 상태로만 사용한다.
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch {
    // 무시
  }
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

export async function sendChat(
  apiKey: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TEACHER_SYSTEM_PROMPT }] },
        contents: history.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
      }),
    },
  );

  const data = (await response.json().catch(() => ({}))) as GeminiResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? `요청에 실패했습니다 (${response.status})`);
  }
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) {
    throw new Error(
      data.promptFeedback?.blockReason
        ? `응답이 차단되었습니다 (${data.promptFeedback.blockReason})`
        : "빈 응답을 받았습니다. 다시 시도해 주세요.",
    );
  }
  return text;
}
