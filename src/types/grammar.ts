// 문법 연습 모듈에서 사용하는 타입 정의

export interface GrammarQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface GrammarCategory {
  id: string;
  title: string;
  description: string;
  ruleExplanation: string;
  examples: string[];
  questions: GrammarQuestion[];
}
