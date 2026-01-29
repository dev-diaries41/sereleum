"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { RadioDropDown } from "./radio-dropdown";

interface SortBySelectorProps<
  T extends readonly string[] = readonly string[]
> {
  options: T;
  sortBy: T[number];
  setSortBy: (key: T[number]) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  labelFor: (key: T[number]) => string;
}


export function SortBySelector<T extends readonly string[]>({
  options,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  labelFor,
}: SortBySelectorProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-start mb-4">
      <div className="relative flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm hover:shadow-md text-sm"
          onClick={() => setDropdownOpen((d) => !d)}
        >
          <FontAwesomeIcon icon={faSort} />
          <span className="text-sm font-medium">{labelFor(sortBy)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
            }}
            className="ml-2 text-gray-400 text-xs"
          >
            <FontAwesomeIcon icon={sortDirection === 'desc' ? faChevronDown : faChevronUp} />
          </button>
        </div>

        <RadioDropDown
          options={options}
          value={sortBy}
          onSelect={(k) => setSortBy(k)}
          labelFor={labelFor}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </div>
  );
}
