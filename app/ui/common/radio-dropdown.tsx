
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RadioDropDownProps<T> {
  options: readonly [string, T][];
  value: T | null;
  onSelect: (value: T) => void;
  open: boolean;
  onClose?: () => void;
  className?: string;
}

export function RadioDropDown<T>({
  options,
  value,
  onSelect,
  open,
  onClose,
  className = "",
}: RadioDropDownProps<T>) {
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
            {options.map(([label, option]) => (
              <label
                key={label}
                className={`flex items-center justify-start gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 ${
                  Object.is(value, option) ? "bg-indigo-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="selector"
                  checked={Object.is(value, option)}
                  onChange={() => {
                    onSelect(option);
                    onClose?.();
                  }}
                  className="ml-2"
                />
                <div className="text-sm font-medium">{label}</div>
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
