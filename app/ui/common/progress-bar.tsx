import { ProgressBarProps } from "@/app/types";

export function ProgressBar({ progress, label = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
        <span className="text-xs font-medium text-gray-600">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-indigo-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
