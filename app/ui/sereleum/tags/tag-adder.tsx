
import { useEffect, useState } from "react";
import { faTag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutoCompleter } from "./auto-complete";
import { checkAutoCompletion } from "@/app/lib/helpers";

interface TagAdderProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTag: (tag: string) => void;
  tags: string[];
}

export function TagAdder({
  isVisible,
  onClose,
  onAddTag,
  tags,
}: TagAdderProps) {
  const [newTag, setNewTag] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [autoCompleteTagResults, setAutoCompleteTagResults] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setAutoCompleteTagResults(
        checkAutoCompletion(newTag, newTag.length, tags, false)
      );
    }, 50);

    return () => clearTimeout(timeout);
  }, [newTag, isVisible, tags]);

  useEffect(() => {
    if (isVisible) {
      setNewTag("");
      setAutoCompleteTagResults([]);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleChange = (value: string) => {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setNewTag(value);
    } else {
      window.alert("Character not allowed");
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onAddTag(newTag);
  };

    const handleSelectTag = (value: string) => {
    setNewTag(value);
  alert('SELECTED VALUE: ' + value)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tag-adder-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="tag-adder-title" className="text-lg font-semibold text-gray-900">
            Add tag
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <FontAwesomeIcon icon={faTag} className="text-indigo-600" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter new tag"
              className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          <AutoCompleter
            isVisible={autoCompleteTagResults.length > 0 && isFocused}
            autoCompleteResults={autoCompleteTagResults}
            query={newTag}
            onSelect={setNewTag}
            label="Tags"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!newTag.trim()}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAddTag}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
