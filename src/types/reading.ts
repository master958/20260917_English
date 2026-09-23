// 독해 연습 모듈에서 사용하는 타입 정의

export type ReadingLevel = "beginner" | "intermediate" | "advanced";

export interface ComprehensionQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: ReadingLevel;
  body: string;
  glossaryWordIds: string[];
  questions: ComprehensionQuestion[];
}
