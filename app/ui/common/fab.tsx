import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FloatingActionButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function FloatingActionButton({
  isOpen,
  onClick
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close actions menu" : "Open actions menu"}
      aria-expanded={isOpen}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-colors hover:bg-indigo-700"
    >
      <FontAwesomeIcon icon={isOpen ? faXmark : faPlus} size="lg" />
    </button>
  );
}