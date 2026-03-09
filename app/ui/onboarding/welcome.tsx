'use client'

import Logo from '../logo'

interface WelcomePageProps {
  welcomeTitle: string
  welcomeMessage: string
  onContinue: () => void
  onSkip: () => void
}

export const WelcomePage = ({
  welcomeTitle,
  welcomeMessage,
  onContinue,
  onSkip,
}: WelcomePageProps) => {
  return (
    <div className="w-full flex items-center justify-center px-4 py-10 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 flex flex-col min-h-[420px]">

        <div className="flex justify-center mb-6">
          <Logo
            name='Sereleum'
            src="/sereleum-infinity-logo.png"
            width={80}
            height={80}
            alt="Sereleum logo"
          />
        </div>

        <h2 className="text-3xl font-semibold text-center mb-3">
          {welcomeTitle}
        </h2>

        <p className="text-center text-gray-600 text-lg mb-8">
          {welcomeMessage}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <button
            type="button"
            aria-label="Skip onboarding"
            onClick={onSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition"
          >
            Skip
          </button>

          <button
            type="button"
            aria-label="Continue to onboarding questions"
            onClick={onContinue}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  )
}