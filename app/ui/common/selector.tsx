
"use client";

import { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { RadioDropDown } from "./radio-dropdown";

interface SelectorProps<T> {
  options: [string, T][];
  selectedOption: T | null;
  onSelect: (value: T) => void;
  label: string;
  children?: ReactNode
}

export function Selector<T>({
  options,
  selectedOption,
  onSelect,
  label,
  children
}: SelectorProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedLabel = options.find(([, value]) => Object.is(value, selectedOption))?.[0] ?? "Select option";

  return (
    <div className="w-full flex items-center justify-start mb-4">
      <div className="relative flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm hover:shadow-md text-sm max-w-[140px]"
        >
          <span className="font-medium truncate">{selectedLabel}</span>
          {children}
        </div>

        <RadioDropDown
          options={options}
          value={selectedOption}
          onSelect={(value) => {
            onSelect(value);
            setDropdownOpen(false);
          }}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </div>
  );
}
