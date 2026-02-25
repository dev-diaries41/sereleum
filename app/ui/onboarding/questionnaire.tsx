'use client'

import { TQuestion, QuestionnaireAnswer } from '@/app/types';
import { useQuestionaire } from '@/app/hooks/useQuestionaire';
import { WelcomePage } from './welcome';
import { useEffect } from 'react';


interface QuestionnaireProps<T extends Record<string, QuestionnaireAnswer>> {
  onboardingQuestions: TQuestion<T>[];
  welcomeTitle: string;
  welcomeMessage: string;
  onComplete: (answers: T) => void;
}

export function Questionnaire<T extends Record<string, QuestionnaireAnswer>>({
  onboardingQuestions,
  welcomeMessage,
  welcomeTitle,
  onComplete,
}: QuestionnaireProps<T>) {

  const {
    isIntroVisible,
    currentIndex,
    answers,
    currentQuestion,
    startQuestionnaire,
    handleAnswerChange,
    goToPrevious,
    goToNext,
    hasAnswer,
    checkIsMultiAnswer,
    isValidMove,
    goTo,
  } = useQuestionaire<T>(onboardingQuestions, onComplete);

  useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = '';
  };
}, []);

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
      {isIntroVisible ? (
        <WelcomePage
          onContinue={startQuestionnaire}
          onSkip={() => onComplete(answers)}
          welcomeMessage={welcomeMessage}
          welcomeTitle={welcomeTitle}
        />
      ) : (
        <div className="bg-white relative w-full max-w-5xl rounded-md shadow-md shadow-black group">
          <div className="relative overflow-hidden rounded-lg p-6 min-h-[400px]">
            <div>
              <div className="flex flex-col gap-2 items-center mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-center">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.allowMultipleAnswers && (
                  <p className="md:text-lg opacity-80">
                    Tick all that apply.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 pt-8">
                {/* Render options or text input based on the question type */}
                {currentQuestion.isTextInput ? (
                  <input
                    type="text"
                    value={answers[currentQuestion.questionCategory] as string || ''}
                    onChange={(e) => handleAnswerChange(currentIndex, e.target.value)}
                    className="form-input p-2 border rounded-md w-full bg-transparent border border-neutral-500"
                    placeholder="Enter your answer"
                  />
                ) : (
                  currentQuestion.options?.map((option, optionIndex) => {
                    // Determine if the option is selected based on answer type
                    const currentAnswer = answers[currentQuestion.questionCategory];
                    const isChecked = checkIsMultiAnswer(currentQuestion)? Array.isArray(currentAnswer) && (currentAnswer as string[]).includes(option) : currentAnswer === option;
                    return (
                      <label key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type={currentQuestion.allowMultipleAnswers ? 'checkbox' : 'radio'}
                          checked={isChecked}
                          onChange={() => handleAnswerChange(currentIndex, option)}
                          className="form-checkbox h-4 w-4 text-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center p-8 pb-16 font-medium text-sm">
            {currentIndex > 0 && (
              <button
                type="button"
                aria-label="Go back to previous question"
                className="flex bg-gray-500 justify-center items-center text-white p-2 rounded-full"
                onClick={goToPrevious}
              >
                Back
              </button>
            )}
            <button
              disabled={!hasAnswer(currentIndex)}
              type="button"
              aria-label="Continue to next question or complete onboarding"
              className={`flex bg-blue-500 justify-center items-center text-white p-2 ml-auto rounded-full ${
                !hasAnswer(currentIndex) ? 'opacity-50' : ''
              }`}
              onClick={goToNext}
            >
              {currentIndex === onboardingQuestions.length - 1 ? 'Complete' : 'Continue'}
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {onboardingQuestions.map((_, dotIndex) => (
              <button
                disabled={!isValidMove(dotIndex) }
                key={dotIndex}
                onClick={() => goTo(dotIndex)}
                className={`h-2.5 w-2.5 rounded-full ${
                  currentIndex === dotIndex ? 'bg-blue-500' : 'bg-gray-300'
                } ${
                  !hasAnswer(dotIndex)? 'opacity-50' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
