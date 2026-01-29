"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RadioDropDownProps<
  T extends readonly string[] = readonly string[]
> {
  options: T;
  value: T[number];
  onSelect: (key: T[number]) => void;
  labelFor: (key: T[number]) => string;
  open: boolean;
  onClose?: () => void;
  className?: string;
}

export function RadioDropDown<
  T extends readonly string[] = readonly string[]
>({ options, value, onSelect, labelFor, open, onClose, className = "" }: RadioDropDownProps<T>) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`absolute top-8 left-0 mt-2 w-56 bg-white rounded-md border z-20 shadow-sm ${className}`}
        >
          <div className="p-3 flex flex-col gap-2">
            {options.map((k) => (
              <label
                key={k}
                className={`flex items-center justify-start gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 ${value === k ? 'bg-indigo-50' : ''}`}
              >
                 <input
                  type="radio"
                  name="sort"
                  checked={value === k}
                  onChange={() => {
                    onSelect(k);
                    onClose?.();
                  }}
                  className="ml-2"
                />
                <div>
                  <div className="text-sm font-medium">{labelFor(k)}</div>
                </div>
               
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
