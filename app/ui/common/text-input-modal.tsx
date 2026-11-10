
"use client";

import { ReactNode } from "react";
import { Modal } from "./modal";

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  children?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextInputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  value,
  onChange,
  placeholder = "Enter text",
  disabled = false,
  leadingIcon,
  children,
  onFocus,
  onBlur,
}: TextInputModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          {leadingIcon}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        {children}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClose}
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
        Cancel
        </button>

        <button
        type="button"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onConfirm}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
        Confirm
        </button>
      </div>
    </Modal>
  );
}
