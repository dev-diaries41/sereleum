'use client'
import { generateEditedImage } from "@/app/lib/server/replicate";
import { ImageEditorInputForm } from "./editor-input-form";
import { ImageEditorOutput } from "./editor-output";
import Spacer from "../utilities/spacer";
import { useState } from "react";
import { updateCredits } from "@/app/lib/server/data/user";
import { checkUsageLimit } from "@/app/lib/server/data/usage";
import usePopUp from "@/app/hooks/usePopUp";
import PopUp from "../common/limit-card";
import { EXCEEDED_CREDIT_LIMIT_DESC } from "@/app/constants/messages";
import { ServiceUsageErrors } from "@/app/constants/errors";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ImageEditorProps {
  email: string;
}

export function ImageEditor ({email}: ImageEditorProps){
  const [outputImage, setOutputImage] = useState<string|null>(null);
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, isPopUpVisible, popUpCta, isPopUpError} = usePopUp();
  const {data:session, update} = useSession();


  const onEditImage = async (prompt: string, input_image: string) => {
    try {
      // const result = await checkUsageLimit(email);
      // if(!result.isAllowed){
      //   if(result.message === ServiceUsageErrors.EXCEEDED_CREDIT_LIMIT){
      //     showPopUp({title:result.message, description:EXCEEDED_CREDIT_LIMIT_DESC, cta: 'Buy credits'});
      //   }
      //   return;
      // }

      const image = await generateEditedImage(prompt, input_image);
      setOutputImage(image);

      const newCreds = await updateCredits(email, -1);
      if(session){
        await update({...session.user, credits: newCreds});
      }
      
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="w-full flex flex-col max-w-7xl mx-auto items-center justify-center text-center py-8 px-4">
      <div className='flex flex-row gap-4 justify-center items-center pt-24'>
        <h1 className="text-center text-4xl my-4 px-3 font-bold">Edit Images</h1>
      </div>
      <p className="text-light mb-2 px-3">
        Upload an image to edit and describe the changes you want to get started.
      </p>
      <Spacer/>
        <div className="w-full max-w-5xl z-50">
      {isPopUpVisible && (
        <PopUp onClose={closePopUp} title={popUpTitle} description={popUpDescription} onConfirmCta={popUpCta} isError={isPopUpError}>
          
           { popUpCta && <Link href={'/#pricing'} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 px-4 max-w-40 w-full md:w-auto mt-4 md:mt-0">
              <span className="flex items-center justify-center">{popUpCta}</span>
            </Link>
            }
        </PopUp>
      )}
      </div>
      <div className="w-full flex flex-col mx-auto items-center text-sm md:text-md">
        <div className={`w-full flex flex-col md:flex-row items-start ${outputImage? "justify-between" : "justify-center"} text-md  mb-2 p-4 gap-32`}>
          <ImageEditorInputForm onEditImage={onEditImage}/>

        {outputImage && (
            <ImageEditorOutput outputImage={outputImage}/>
          )}
        </div>
    </div>
  </div>
  );
}