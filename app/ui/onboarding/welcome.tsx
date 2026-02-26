'use client'
import Logo from '../logo';

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
    <div className="bg-white relative w-full max-w-5xl mx-auto rounded-md shadow-md group animate-fadeIn">
      <div className="flex flex-col rounded-lg p-6 min-h-[400px]">
        <Logo
          src={'/sereleum-infinity-logo.png'}
          width={80} 
          height={80}
          alt={'logo'}
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