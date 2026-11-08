
"use client";

import { useEffect, useState } from "react";
import { Selector } from "./selector";

interface SelectorModalProps<T> {
  isVisible: boolean;
  title: string;
  options: [string, T][];
  onClose: () => void;
  onConfirm: (value: T) => void;
  label: string;
  initialOption?: T | null;
}

export function SelectorModal<T>({
  isVisible,
  title,
  options,
  onClose,
  onConfirm,
  label,
  initialOption = null,
}: SelectorModalProps<T>) {
  const [selectedOption, setSelectedOption] = useState<T | null>(initialOption);

  useEffect(() => {
    if (isVisible) setSelectedOption(initialOption);
  }, [isVisible, initialOption]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div role="dialog" aria-modal="true" className="w-full max-w-md mx-4 rounded-lg bg-white shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-6">{title}</h2>

        <Selector
          options={options}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          label={label}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={() => selectedOption !== null && onConfirm(selectedOption)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
