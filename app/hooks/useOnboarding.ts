import {useEffect, useState } from 'react'
import { StorageKeys } from '@/app/constants/global';
import * as LocalStorage from '@/app/lib/client/storage/local';
import { OnboardingAnswers } from '@/app/types';
import { completedOnboarding } from '../lib/server/data/user';
import { useSession } from 'next-auth/react';


const useOnboarding = (email: string | null | undefined) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(true);
    const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);

    const {data:authSession, update} = useSession();

    useEffect(() => {
        const result = LocalStorage.get<string>(StorageKeys.onboarding);
        if(result !== 'complete'){
            setIsOnboarded(false);
        }
    
      }, [])

    useEffect(() => {
        if(authSession && answers !== null){
          update({...authSession.user, metadata: {...(authSession.user.metadata || {}), answers: answers}});
          setAnswers(null);
      }
    }, [authSession, answers])

    const closeOnboardingPopUp = () => {
        setIsVisible(false);
    };

    const onCompleteOnboarding = async (answers: OnboardingAnswers) => {
        if (email) {
            closeOnboardingPopUp();
            await completedOnboarding(email, answers);
            setAnswers(answers)
            LocalStorage.set(StorageKeys.onboarding, 'complete');
        }
    };

    return {
        isVisible,
        isOnboarded,
        closeOnboardingPopUp,
        onCompleteOnboarding,
    };
};

export default useOnboarding;
