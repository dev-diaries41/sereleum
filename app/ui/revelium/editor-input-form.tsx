'use client'
import { AcceptedImgMimes } from "@/app/constants/global";
import DragAndDropUpload from "@/app/ui/common/drag-upload";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUpload from "@/app/hooks/useUpload";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import LoadingIndicator from "../utilities/circle-loading-indicator";
import { ChangeEvent, useState } from "react";
import FileUploader from "../common/upload";

interface EditorInputFormProps {
    onEditImage: (prompt: string, input_image: string) => void;
}

export function ImageEditorInputForm({
    onEditImage
}: EditorInputFormProps){
    const [prompt, setPrompt] = useState('');
    const { media, uploadMedia, removeAllMedia } = useUpload();


    const clearPrompt = () => {
            setPrompt('')
    }

    const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(event.target.value)
    }

    const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto'; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }

  return (
    <form action={() => onEditImage(prompt, media[0])} className="w-full max-w-[100%] md:max-w-[50%] flex flex-col gap-8">
        {media.length > 0 ? (
        <div className="relative w-full aspect-[1/1] rounded-md overflow-hidden border border-gray-300 dark:border-[#555] bg-transparent">
            <Image
            src={media[0]}
            alt="Uploaded"
            fill
            unoptimized
            className="object-contain"
            />
            <button
            onClick={() => {
                removeAllMedia()
            }}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full w-6 h-6 flex items-center justify-center"
            aria-label="Remove uploaded image"
            >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
        </div>
        ) : (
        <DragAndDropUpload onFileUpload={uploadMedia} acceptedMimes={AcceptedImgMimes}>
             <FileUploader 
                className = "flex mx-auto px-4 justify-center items-center block cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-semibold p-2 rounded-3xl shadow-md"
                onFileUpload={uploadMedia} acceptedMimes={AcceptedImgMimes}>
                    Upload Image
            </FileUploader>
            <p className='text-lg mt-12'>Or drop a file</p>
        </DragAndDropUpload>
        )}

        <div className="flex flex-col items-start justify-start w-full rounded-md">
        <label
            htmlFor="prompt"
            className="block text-left font-medium mb-1"
        >
            Prompt:
        </label>
        <div className="w-full rounded-md border border-gray-300 dark:border-[#555] mb-4">
            <textarea
            id="prompt"
            name="prompt"
            placeholder="Enter prompt..."
            className="flex-grow w-full p-2 bg-transparent rounded-md focus:outline-none resize-none overflow-hidden"
            value={prompt}
            onChange={(e) => {
                handlePromptChange(e);
                autoResizeTextarea(e.target);
            }}
            aria-describedby="prompt-error"
            />
        </div>
        <EditButton enabled={media.length > 0 && !!prompt} />
        </div>
    </form>
  );
}

function EditButton({enabled}: {enabled: boolean;}){
  const {pending} = useFormStatus();
  const disabled = pending || !enabled;
  return (
    <button
        type="submit"
        disabled={disabled}
        className={`flex  items-center justify-center bg-emerald-600 text-sm  ml-auto text-white font-semibold p-2 px-4 rounded-full shadow-md gap-2 ${disabled? 'opacity-50' : 'opacity-100 hover:bg-emerald-500'}`}
      >
        <span className="">{pending? "Editing" : "Edit"} image</span>
        {pending && <LoadingIndicator/>}
    </button>
    ) 
}