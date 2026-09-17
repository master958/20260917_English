// 완료율(%)을 시각적으로 보여주는 진행 바 컴포넌트
interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  return (
    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-3 rounded-full bg-blue-600 transition-all dark:bg-blue-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
