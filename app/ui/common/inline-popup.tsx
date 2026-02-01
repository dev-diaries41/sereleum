import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { BasePopUpProps } from "@/app/types";

export function InlinePopUp({
  title,
  description,
  children,
  isError,
  onClose,
}: BasePopUpProps) {
  return (
    <div
      className={`flex items-start gap-4 my-4 p-4 border-2 border-gray-300 rounded-2xl ${
        isError ? "bg-red-300" : "bg-white"
      } w-full mx-auto shadow-md`}
    >
      <div className="flex flex-col flex-grow md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col text-left">
          <h1 className="font-semibold">{title}</h1>
          <div className="">{description}</div>
        </div>
        {children}
      </div>

      <button
        onClick={onClose}
        className="flex items-center justify-center w-6 h-6 rounded-full p-2 self-start"
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faXmark} className="hover:text-gray-500 opacity-80 w-4 h-4" />
      </button>
    </div>
  );
}
