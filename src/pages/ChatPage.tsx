// 사용자가 입력한 Gemini API 키로 AI 영어 선생님과 대화하는 채팅 화면
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GEMINI_MODEL,
  LEVEL_LABELS,
  MODE_LABELS,
  clearApiKey,
  loadApiKey,
  loadSettings,
  saveApiKey,
  saveSettings,
  sendChat,
} from "../services/geminiChat";
import type { ChatMessage, TeacherLevel, TeacherMode, TeacherSettings } from "../services/geminiChat";
import { MarkdownMessage } from "../components/MarkdownMessage";
import {
  isRecognitionSupported,
  isSynthesisSupported,
  speak,
  startRecognition,
  stopSpeaking,
} from "../services/speech";
import type { Recognizer } from "../services/speech";

const FOLLOW_UP_CHIPS = ["비슷한 문제 3개 더 내줘", "더 쉽게 설명해줘", "예문 더 보여줘"];
const STARTER_CHIPS = ["오늘의 영어 표현 알려줘", "현재완료와 과거의 차이가 뭐야?", "영어로 자기소개를 써볼게 교정해줘"];

export function ChatPage() {
  const [apiKey, setApiKey] = useState(loadApiKey);
  const [keyInput, setKeyInput] = useState("");
  const [settings, setSettings] = useState<TeacherSettings>(loadSettings);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const recognizerRef = useRef<Recognizer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // 오답노트 등에서 넘어온 첫 질문 (키가 준비되면 한 번만 자동 전송)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(
    () => (location.state as { initialPrompt?: string } | null)?.initialPrompt ?? null,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSaveKey = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setApiKey(trimmed);
    setKeyInput("");
  };

  const updateSettings = (patch: Partial<TeacherSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  const handleRemoveKey = () => {
    clearApiKey();
    setApiKey("");
    setMessages([]);
    setError(null);
  };

  const submit = async (text: string, base: ChatMessage[]) => {
    const next: ChatMessage[] = [...base, { role: "user", text }];
    setMessages(next);
    setError(null);
    setLoading(true);
    try {
      const reply = await sendChat(apiKey, next, settings);
      setMessages([...next, { role: "model", text: reply }]);
      if (autoRead) speak(reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pendingPrompt || !apiKey) return;
    setPendingPrompt(null);
    navigate(location.pathname, { replace: true, state: null });
    void submit(pendingPrompt, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt, apiKey]);

  const toggleListening = () => {
    if (listening) {
      recognizerRef.current?.stop();
      return;
    }
    const recognizer = startRecognition(
      (text) => setInput((prev) => (prev ? `${prev} ${text}` : text)),
      () => {
        recognizerRef.current = null;
        setListening(false);
      },
    );
    if (recognizer) {
      recognizerRef.current = recognizer;
      setListening(true);
    }
  };

  useEffect(() => () => {
    recognizerRef.current?.stop();
    stopSpeaking();
  }, []);

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    void submit(text, messages);
  };

  if (!apiKey) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 영어 선생님</h1>
        <form
          onSubmit={handleSaveKey}
          className="space-y-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <label
            htmlFor="gemini-key"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Gemini API 키
          </label>
          <input
            id="gemini-key"
            type="password"
            autoComplete="off"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIza..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            키는 이 브라우저(localStorage)에만 저장되며 Google Gemini API 호출에만 사용됩니다.
            Google AI Studio에서 발급받을 수 있습니다.
          </p>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            저장하고 시작하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 영어 선생님</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">모델: {GEMINI_MODEL}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMessages([])}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            대화 초기화
          </button>
          <button
            type="button"
            onClick={handleRemoveKey}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            API 키 삭제
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300">
        <label className="flex items-center gap-2">
          레벨
          <select
            value={settings.level}
            onChange={(e) => updateSettings({ level: e.target.value as TeacherLevel })}
            className="rounded-md border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
          >
            {Object.entries(LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          모드
          <select
            value={settings.mode}
            onChange={(e) => updateSettings({ mode: e.target.value as TeacherMode })}
            className="rounded-md border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
          >
            {Object.entries(MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isSynthesisSupported() && (
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={autoRead}
            onChange={(e) => {
              setAutoRead(e.target.checked);
              if (!e.target.checked) stopSpeaking();
            }}
          />
          답변 자동 읽기 (영어 문장만)
        </label>
      )}

      <div className="h-[60vh] space-y-3 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            영어에 대해 무엇이든 물어보세요. 영어로 문장을 써 보면 교정해 드립니다.
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] break-words rounded-lg px-3 py-2 text-sm ${
                message.role === "user"
                  ? "whitespace-pre-wrap bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {message.role === "model" ? <MarkdownMessage text={message.text} /> : message.text}
              {message.role === "model" && isSynthesisSupported() && (
                <button
                  type="button"
                  onClick={() => speak(message.text)}
                  aria-label="영어 읽어주기"
                  className="mt-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  🔊 듣기
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">선생님이 답변 중…</p>}
        <div ref={bottomRef} />
      </div>

      {!loading && (
        <div className="flex flex-wrap gap-2">
          {(messages.length === 0
            ? STARTER_CHIPS
            : messages[messages.length - 1].role === "model"
              ? FOLLOW_UP_CHIPS
              : []
          ).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void submit(chip, messages)}
              className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          aria-label="메시지 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문이나 영어 문장을 입력하세요"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        />
        {isRecognitionSupported() && (
          <button
            type="button"
            onClick={toggleListening}
            aria-pressed={listening}
            aria-label={listening ? "음성 입력 중지" : "음성 입력"}
            className={`rounded-md border px-3 py-2 text-sm ${
              listening
                ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            🎤
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          전송
        </button>
      </form>
    </div>
  );
}
