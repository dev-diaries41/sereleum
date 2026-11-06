"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { RadioDropDown } from "./radio-dropdown";

interface SelectorProps<T extends readonly (string | number)[] = readonly (string | number)[]> {
  options: T;
  sortBy: T[number];
  onSelect: (key: T[number]) => void;
  label: string;
  sortDirection: 'asc' | 'desc';
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  labelFor: (key: T[number]) => string;
}


export function Selector<T extends readonly string[]>({
  options,
  sortBy,
  label,
  onSelect,
  labelFor,
}: SelectorProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-start mb-4">
      <div className="relative flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm hover:shadow-md text-sm"
          onClick={() => setDropdownOpen((d) => !d)}
        >
            <span className="text-sm font-medium">{labelFor(sortBy)}</span>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-400 text-xs"/>
        </div>

        <RadioDropDown
          options={options}
          value={sortBy}
          onSelect={onSelect}
          labelFor={labelFor}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </div>
  );
}
