// 학습 진도(오답노트, 완료여부, 정답률) 관련 타입 정의

export interface WrongAnswerEntry {
  questionId: string;
  categoryId: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  selectedIndex: number;
  recordedAt: string;
}

export interface GrammarCategoryProgress {
  completed: boolean;
  correctCount: number;
  totalCount: number;
  lastAttemptedAt: string;
}

export interface ReadingPassageProgress {
  completed: boolean;
  correctCount: number;
  totalCount: number;
  lastAttemptedAt: string;
}

export interface ProgressState {
  schemaVersion: number;
  grammar: Record<string, GrammarCategoryProgress>;
  reading: Record<string, ReadingPassageProgress>;
  wrongAnswers: WrongAnswerEntry[];
}
