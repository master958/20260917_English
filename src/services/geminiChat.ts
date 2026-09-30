// Gemini REST API로 영어 선생님 AI와 대화하는 서비스 (사용자가 입력한 API 키를 브라우저에서 직접 사용)
export const GEMINI_MODEL = "gemini-3.5-flash-lite";
const API_KEY_STORAGE_KEY = "english-app-gemini-api-key";

export type ChatRole = "user" | "model";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export type TeacherLevel = "beginner" | "intermediate" | "advanced";
export type TeacherMode = "free" | "grammar" | "conversation" | "writing";

export interface TeacherSettings {
  level: TeacherLevel;
  mode: TeacherMode;
}

export const DEFAULT_SETTINGS: TeacherSettings = { level: "beginner", mode: "free" };

export const LEVEL_LABELS: Record<TeacherLevel, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export const MODE_LABELS: Record<TeacherMode, string> = {
  free: "자유 질문",
  grammar: "문법 교정",
  conversation: "회화 연습",
  writing: "작문 첨삭",
};

const LEVEL_PROMPTS: Record<TeacherLevel, string> = {
  beginner:
    "The student is a beginner: use simple words and short sentences, explain mainly in Korean, and avoid grammar jargon.",
  intermediate:
    "The student is intermediate: mix Korean explanations with English, and introduce natural expressions and basic grammar terms.",
  advanced:
    "The student is advanced: explain nuance, register and collocations, and use mostly English with Korean only for key points.",
};

const MODE_PROMPTS: Record<TeacherMode, string> = {
  free: "Answer the student's questions about English clearly with examples, and end with a short practice prompt when useful.",
  grammar:
    "Focus on grammar: correct every mistake in the student's English, show the corrected sentence, and give a short reason for each fix.",
  conversation:
    "Role-play a natural conversation in English at the student's level. Reply briefly in English, ask one follow-up question, and add a short Korean note only when correcting a mistake.",
  writing:
    "Act as a writing coach: revise the student's text, show the improved version, list the key changes, and suggest one way to make it better.",
};

export function buildSystemPrompt(settings: TeacherSettings = DEFAULT_SETTINGS): string {
  return [
    "You are a friendly, patient English teacher for Korean learners.",
    LEVEL_PROMPTS[settings.level],
    MODE_PROMPTS[settings.mode],
    "Keep answers concise and well organized. Use Markdown (bold, lists) sparingly.",
  ].join(" ");
}

const SETTINGS_STORAGE_KEY = "english-app-teacher-settings";

export function loadSettings(): TeacherSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}");
    return {
      level: parsed.level in LEVEL_LABELS ? parsed.level : DEFAULT_SETTINGS.level,
      mode: parsed.mode in MODE_LABELS ? parsed.mode : DEFAULT_SETTINGS.mode,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TeacherSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // 저장이 막힌 환경에서는 현재 세션 상태로만 사용한다.
  }
}

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
  settings: TeacherSettings = DEFAULT_SETTINGS,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(settings) }] },
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
