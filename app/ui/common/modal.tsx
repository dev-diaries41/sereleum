
"use client";

import { ReactNode, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "max-w-3xl",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
