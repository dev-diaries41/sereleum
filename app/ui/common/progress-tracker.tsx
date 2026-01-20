import { IndexProgressTrackerPopUpProps } from "@/app/types";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "./progress-bar";

export function IndexProgressTrackerPopUp({
  progress,
  status,
  label,
  title,
  description,
  minimized,
  onMinimize,
}: IndexProgressTrackerPopUpProps ) {


  if (minimized) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px]">
      {/* unchanged body */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onMinimize}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Minimize indexing progress"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
        </div>

        <ProgressBar progress={progress} label={label} />

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">Status</span>
          <span
            className={`font-medium ${
              status === 'complete'
                ? 'text-green-600'
                : status === 'active'
                ? 'text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

