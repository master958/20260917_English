// 객관식 퀴즈를 진행하고 채점 결과를 보여주는 공용 컴포넌트
import { useState } from "react";
import { gradeQuiz } from "../services/scoring";

export interface QuizQuestionLike {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

export interface QuizCompleteResult {
  correctCount: number;
  totalCount: number;
  selections: Record<string, number>;
}

interface QuizRunnerProps {
  questions: QuizQuestionLike[];
  onComplete: (result: QuizCompleteResult) => void;
  submitLabel?: string;
}

export function QuizRunner({
  questions,
  onComplete,
  submitLabel = "채점하기",
}: QuizRunnerProps) {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((question) => selections[question.id] !== undefined);

  const handleSubmit = () => {
    const result = gradeQuiz(questions, selections);
    setSubmitted(true);
    onComplete({
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      selections,
    });
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-lg border border-gray-200 p-4">
          <p className="mb-3 font-medium text-gray-900">
            {index + 1}. {question.prompt}
          </p>
          <div className="space-y-2">
            {question.choices.map((choice, choiceIndex) => {
              const isSelected = selections[question.id] === choiceIndex;
              const isCorrectChoice = choiceIndex === question.answerIndex;
              let stateClass = "border-gray-300 hover:border-gray-400";
              if (submitted && isCorrectChoice) {
                stateClass = "border-green-500 bg-green-50";
              } else if (submitted && isSelected && !isCorrectChoice) {
                stateClass = "border-red-500 bg-red-50";
              } else if (!submitted && isSelected) {
                stateClass = "border-blue-500 bg-blue-50";
              }
              return (
                <button
                  key={choiceIndex}
                  type="button"
                  disabled={submitted}
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelections((prev) => ({ ...prev, [question.id]: choiceIndex }))
                  }
                  className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${stateClass}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          {submitted && question.explanation && (
            <p className="mt-3 rounded-md bg-gray-50 p-2 text-sm text-gray-600">
              {question.explanation}
            </p>
          )}
        </div>
      ))}
      {!submitted && (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={handleSubmit}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
}
