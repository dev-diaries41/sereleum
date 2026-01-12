import Image from "next/image";

interface ImageEditorOutputProps {
    outputImage: string;
}

export function ImageEditorOutput ({outputImage}: ImageEditorOutputProps){

  const handleDownload = async () => {
    const response = await fetch(outputImage, { mode: 'cors' });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full md:max-w-[50%] flex flex-col items-center gap-2">
        <div className="relative w-full aspect-[1/1] rounded-md overflow-hidden border border-gray-300 dark:border-[#555] bg-transparent">
        <Image
            src={outputImage}
            alt="Output"
            fill
            unoptimized
            className="object-contain"
        />
        </div>
        <button
        onClick={handleDownload}
        className={`flex  items-center justify-center border border-emerald-600 hover:bg-emerald-100 transition text-sm  ml-auto font-semibold p-2 px-4 rounded-full gap-2 `}
        >
        Download
        </button>
    </div>
  );
}