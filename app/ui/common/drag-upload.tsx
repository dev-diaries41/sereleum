'use client';
import { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { FileUploaderProps } from '@/app/types';
import clsx from 'clsx';

export default function DragAndDropUpload({ 
  onFileUpload, 
  acceptedMimes, 
  fileLimit = 1,
  maxSize,
  children,
  className
}: FileUploaderProps) {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accept: Accept = acceptedMimes?.reduce((acc, ext) => {
    acc[ext] = [];
    return acc;
  }, {} as Accept);

  const { getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: (acceptedFiles) => {
      setErrorMessage(null); 
      onFileUpload(acceptedFiles); 
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'too-many-files')) {
        setErrorMessage(`You can only upload up to ${fileLimit} file(s).`);
      };

      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'file-invalid-type')) {
        setErrorMessage(`Unsupported file types.`);
      }

      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'file-too-large')) {
        setErrorMessage(`Max file size exceeded.`);
      }
    },
    accept,
    maxFiles: fileLimit,
    maxSize
  });


  return (
    <div className='w-full'>
        {errorMessage && (
        <p className="text-left text-red-500 my-2">{errorMessage}</p>
      )}
      <div
        {...getRootProps()}
        className={clsx(
          className,
          'flex flex-col justify-center items-center w-full h-[50vh] mx-auto border border-gray-300 dark:border-[#555] bg-white dark:bg-[#333] p-6 rounded-md text-center shadow shadow-black',
          isDragActive ? 'border-emerald-500' : 'border-gray-500'
        )}
        >
        {children}
      </div>    
    </div>
  );
}
