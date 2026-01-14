'use client'
import { CTAPopUpProps } from '@/app/types';


export default function PopUp ({ onClose, onConfirm, title, description, onConfirmCta, onCloseCta, onCloseClassName, onConfirmClassName }: CTAPopUpProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 lg:p-0 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-lg min-h-[200px] animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="mb-6 text-left opacity-80">
          {description}
        </p>
        <div className="flex justify-end gap-2 items-center text-sm">
         { onClose && <button
            onClick={onClose}
            className={`${onCloseClassName || "px-4 py-2 bg-transparent hover:bg-gray-300 border border-gray-300 font-medium rounded-full shadow-sm" }`}
          >
            {onCloseCta || 'Dismiss'} 
          </button>}
          {onConfirm && 
          <form action={onConfirm}>
           <button
            type='submit'
            onClick={onConfirm}
            className={`${onConfirmClassName || "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full shadow-sm" }`}
            >
            {onConfirmCta || 'Ok'}
            </button>
          </form>
          }
        </div>
      </div>
    </div>
  );
};
