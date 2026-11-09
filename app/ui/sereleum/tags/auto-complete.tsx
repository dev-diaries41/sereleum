
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AutoCompleterProps {
  isVisible: boolean;
  autoCompleteResults: string[];
  query: string;
  onSelect: (value: string) => void;
  label?: string;
}

export function AutoCompleter({
  isVisible,
  autoCompleteResults,
  query,
  onSelect,
  label,
}: AutoCompleterProps) {
  if (!isVisible) return null;

  const cleanedQuery =
    query.startsWith("#") && query.length > 1 ? query.substring(1) : query;

  return (
    <div className="w-full max-h-[300px] overflow-y-auto rounded-lg bg-white p-4">
      {label && (
        <p className="mb-3 text-sm font-semibold text-gray-700">{label}</p>
      )}

      <div className="flex flex-col gap-2">
        {autoCompleteResults.map((result, index) => {
          const matches = result.toLowerCase().startsWith(cleanedQuery.toLowerCase());
          const matchLength = matches
            ? Math.min(cleanedQuery.length, result.length)
            : 0;

          return (
            <button
              key={`${result}-${index}`}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(result)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faTag} className="text-gray-700" />
              <span className="text-base text-gray-900">
                {matchLength > 0 ? (
                  <>
                    <span className="text-indigo-600">
                      {result.substring(0, matchLength)}
                    </span>
                    {result.substring(matchLength)}
                  </>
                ) : result}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
