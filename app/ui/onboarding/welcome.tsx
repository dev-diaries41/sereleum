'use client'
import Image from 'next/image';

interface WelcomePageProps {
  welcomeTitle: string;
  welcomeMessage: string;
  onContinue: () => void;
  onSkip: () => void;
}

export const WelcomePage = ({
  welcomeMessage,
  welcomeTitle,
  onContinue,
  onSkip,
}: WelcomePageProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 relative w-full max-w-5xl mx-auto rounded-md shadow-md shadow-black group animate-fadeIn">
      <div className="flex flex-col rounded-lg p-6 min-h-[400px]">
        <Image
          src={'/grademe-logo.png'}
          alt={'logo'}
          width={40}
          height={40}
          className="max-w-9 max-h-9 md:max-w-12 md:max-h-12 mb-4"
          priority={true}
        />
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
          {welcomeTitle}
        </h2>
        <p className="text-center mb-4 font-medium md:text-lg">
          {welcomeMessage}
        </p>
        <div className="w-full flex flex-row items-center justify-between gap-2 mt-auto">
          <button
            type="button"
            aria-label="Skip onboarding"
            className="flex justify-center items-center p-2 rounded-full"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            type="button"
            aria-label="Continue to onboarding questions"
            className="flex bg-blue-500 justify-center items-center text-white p-2 rounded-full"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};