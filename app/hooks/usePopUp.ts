import {useState } from 'react'

const usePopUp = () => {
    const [popUpTitle, setPopUpTitle] = useState('');
    const [popUpDescription, setPopUpDescription] = useState('');
    const [popUpCta, setPopUpCta] = useState<string|undefined>(undefined);
    const [isPopUpError, setIsPopUpError] = useState<boolean|undefined>(undefined);
    const isPopUpVisible = popUpTitle && popUpDescription;

    const closePopUp = () => {
        setPopUpTitle('');
        setPopUpDescription('');  
        setPopUpCta('');
        setIsPopUpError(false);
    }

    type PopUpParams =  {
        title: string, 
        description: string, 
        cta?: string, 
        isError?: boolean
    }

    const showPopUp=({title, description, cta, isError}: PopUpParams)=> {
        setPopUpTitle(title);
        setPopUpDescription(description);
        setPopUpCta(cta);
        setIsPopUpError(isError);
    }


    return {
        popUpCta,
        popUpTitle,
        popUpDescription,
        isPopUpVisible,
        isPopUpError,
        closePopUp, 
        showPopUp
    };
}

export default usePopUp;

