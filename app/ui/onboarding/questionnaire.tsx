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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-10 animate-fadeIn">
      {isIntroVisible ? (
        <WelcomePage
          onContinue={startQuestionnaire}
          onSkip={() => onComplete(answers)}
          welcomeMessage={welcomeMessage}
          welcomeTitle={welcomeTitle}
        />
      ) : (
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 flex flex-col relative min-h-[420px]">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-center">
              {currentQuestion.question}
            </h2>
            {currentQuestion.allowMultipleAnswers && (
              <p className="text-center text-gray-600">
                Tick all that apply.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {currentQuestion.isTextInput ? (
              <input
                type="text"
                value={answers[currentQuestion.questionCategory] as string || ''}
                onChange={(e) => handleAnswerChange(currentIndex, e.target.value)}
                className="form-input p-2 border rounded-md w-full bg-transparent border-neutral-500"
                placeholder="Enter your answer"
              />
            ) : (
              currentQuestion.options?.map((option, optionIndex) => {
                const currentAnswer = answers[currentQuestion.questionCategory];
                const isChecked = checkIsMultiAnswer(currentQuestion)
                  ? Array.isArray(currentAnswer) && (currentAnswer as string[]).includes(option)
                  : currentAnswer === option;
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

          <div className="flex justify-between mt-auto">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={goToPrevious}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-md transition"
              >
                Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={goToNext}
              disabled={!hasAnswer(currentIndex)}
              className={`px-6 py-2 rounded-md text-white transition ${
                hasAnswer(currentIndex) ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {currentIndex === onboardingQuestions.length - 1 ? 'Complete' : 'Continue'}
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {onboardingQuestions.map((_, dotIndex) => (
              <button
                key={dotIndex}
                disabled={!isValidMove(dotIndex)}
                onClick={() => goTo(dotIndex)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  currentIndex === dotIndex ? 'bg-indigo-600' : 'bg-gray-300'
                } ${!hasAnswer(dotIndex) ? 'opacity-50' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}