import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CTAPopUpProps } from "@/app/types";
import clsx from "clsx";

export default function SlimPopUp({ title, description, children, isError, onClose }: CTAPopUpProps){
  return (
    <div
      className={clsx(
        "flex items-start justify-between my-4 gap-4 p-4 rounded-2xl shadow-md border w-full mx-auto shadow-black",
        isError
      ? "bg-[rgba(255,0,0,0.1)] border-red-400"
          : "bg-white dark:bg-[#333] border-gray-300 dark:border-[#555]"
      )}
    >       
    <div className="flex flex-col flex-grow md:flex-row md:items-center md:justify-between">
          {/* Main Content */}
          <div className="flex flex-col pr-8 text-left">
            <h1 className="font-bold">
              {title}
            </h1>
            <p className="">
            {description}
            </p>
          </div>

          {children}
        </div>

        <button
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 bg-transparent rounded-full hover:bg-gray-200 dark:hover:bg-[#222] p-2 mt-3"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="opacity-80 w-4 h-4" />
        </button>
      </div>
  );
};

