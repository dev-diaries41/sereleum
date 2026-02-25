import { useState } from "react";
import { TQuestion, QuestionnaireAnswer } from "@/app/types";

export function useQuestionaire<T extends Record<string, QuestionnaireAnswer>>(
    onboardingQuestions: TQuestion<T>[],
    onComplete: (answers: T) => void
  ) {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<T>({} as T);
    const currentQuestion = onboardingQuestions[currentIndex];
  
    const startQuestionnaire = () => {
      setIsIntroVisible(false);
    };
  
    const handleAnswerChange = (questionIndex: number, selectedOption: string) => {
      const question = onboardingQuestions[questionIndex];
      const key = question.questionCategory;
      const previousAnswer = answers[key];
  
      setAnswers((prevAnswers) => {
        if (question.allowMultipleAnswers) {
          // Ensure we treat the answer as an array of strings
          const currentOptions = Array.isArray(previousAnswer)? (previousAnswer as string[]) : [];
          const isSelected = currentOptions.includes(selectedOption);
          return {
            ...prevAnswers,
            [key]: isSelected
              ? (currentOptions.filter((opt) => opt !== selectedOption) as QuestionnaireAnswer)
              : ([...currentOptions, selectedOption] as QuestionnaireAnswer),
          };
        } else {
          // For single-answer questions, set the value directly
          return {
            ...prevAnswers,
            [key]: selectedOption as QuestionnaireAnswer,
          };
        }
      });
    };
  
    const goToPrevious = () => {
      if (currentIndex === 0) return;
      setCurrentIndex((prevIndex) => prevIndex - 1);
    };
  
    const goToNext = () => {
      if (currentIndex === onboardingQuestions.length - 1) {
        onComplete(answers);
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    };
  
    const checkIsMultiAnswer = (question: TQuestion<T>) => !!question.allowMultipleAnswers;
   
    const hasAnswer = (questionIndex: number) => {
      const answer = answers[onboardingQuestions[questionIndex]?.questionCategory];
      if(!answer) return false;

      const question = onboardingQuestions[questionIndex];

      if (checkIsMultiAnswer(question)) {
        return Array.isArray(answer) && answer.length > 0;
      }
      return typeof answer === 'string' && answer !== '';
    };
  
    const isValidMove = (questionIndex: number) => {
      if(hasAnswer(questionIndex)){
        return true;
      }if(hasAnswer(questionIndex - 1)){
        return true;
      }
      else if(questionIndex < currentIndex){
        return true;
      }
      return false;
    }

    const goTo = (dotIndex: number) => {
      if(isValidMove(dotIndex)){
        setCurrentIndex(dotIndex)
      }
    }

    return {
      isIntroVisible,
      currentIndex,
      answers,
      currentQuestion,
      startQuestionnaire,
      handleAnswerChange,
      goTo,
      goToPrevious,
      goToNext,
      hasAnswer,
      checkIsMultiAnswer,
      isValidMove,
      setCurrentIndex, // Exposed for direct dot-navigation if needed
    };
  }