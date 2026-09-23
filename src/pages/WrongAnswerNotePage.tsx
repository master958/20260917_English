// 오답노트: 틀린 문제를 다시 풀어보며 재학습하는 페이지 컴포넌트
import { useState } from "react";
import { useProgress } from "../hooks/useProgress";

export function WrongAnswerNotePage() {
  const { state, removeWrongAnswer } = useProgress();
  const [retrySelections, setRetrySelections] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, "correct" | "incorrect">>({});

  const handleRetry = (questionId: string, choiceIndex: number, answerIndex: number) => {
    setRetrySelections((prev) => ({ ...prev, [questionId]: choiceIndex }));
    if (choiceIndex === answerIndex) {
      setFeedback((prev) => ({ ...prev, [questionId]: "correct" }));
    } else {
      setFeedback((prev) => ({ ...prev, [questionId]: "incorrect" }));
    }
  };

  if (state.wrongAnswers.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">오답노트</h1>
        <p className="text-gray-500 dark:text-gray-400">
          아직 틀린 문제가 없습니다. 잘하고 있어요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">오답노트</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        다시 정답을 맞히면 오답노트에서 자동으로 제거됩니다.
      </p>
      <ul className="space-y-4">
        {state.wrongAnswers.map((entry) => {
          const selected = retrySelections[entry.questionId];
          const status = feedback[entry.questionId];
          return (
            <li
              key={entry.questionId}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{entry.prompt}</p>
              <div className="mt-3 space-y-2">
                {entry.choices.map((choice, choiceIndex) => {
                  const isSelected = selected === choiceIndex;
                  let stateClass = "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500";
                  if (isSelected && status === "correct") {
                    stateClass = "border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950/40";
                  } else if (isSelected && status === "incorrect") {
                    stateClass = "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/40";
                  }
                  return (
                    <button
                      key={choiceIndex}
                      type="button"
                      onClick={() =>
                        handleRetry(entry.questionId, choiceIndex, entry.answerIndex)
                      }
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm text-gray-900 transition-colors dark:text-gray-100 ${stateClass}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {status === "incorrect" && (
                <p className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
                  {entry.explanation}
                </p>
              )}
              {status === "correct" && (
                <div className="mt-2 flex items-center justify-between rounded-md bg-green-50 p-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <span>정답입니다!</span>
                  <button
                    type="button"
                    onClick={() => removeWrongAnswer(entry.questionId)}
                    className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
                  >
                    오답노트에서 제거
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
