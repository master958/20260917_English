// 브라우저 Web Speech API 래퍼: 음성 입력(받아쓰기)과 영어 답변 읽어주기 (별도 API 키 불필요)

interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type RecognitionCtor = new () => RecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface Recognizer {
  stop: () => void;
}

// 영어 음성을 인식해 최종 텍스트를 onText로 전달한다. 종료(성공/실패/중지) 시 onEnd가 호출된다.
export function startRecognition(
  onText: (text: string) => void,
  onEnd: () => void,
): Recognizer | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript ?? "")
      .join(" ")
      .trim();
    if (transcript) onText(transcript);
  };
  recognition.onerror = () => onEnd();
  recognition.onend = () => onEnd();
  recognition.start();
  return { stop: () => recognition.stop() };
}

// 읽어주기용 텍스트: 마크다운 기호와 한글이 포함된 줄(설명)은 빼고 영어 문장만 남긴다.
export function extractSpeakableEnglish(markdown: string): string {
  return markdown
    .split("\n")
    .filter((line) => !/[가-힣]/.test(line))
    .map((line) => line.replace(/[*_`#>]|^\s*[-*]\s+|^\s*\d+\.\s+/g, "").trim())
    .filter(Boolean)
    .join(". ");
}

export function speak(text: string): boolean {
  if (!isSynthesisSupported()) return false;
  const speakable = extractSpeakableEnglish(text);
  if (!speakable) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speakable);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSynthesisSupported()) window.speechSynthesis.cancel();
}
