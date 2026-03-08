import { OnboardingAnswers, TQuestion } from "@/app/types";

export const ONBOARDING_WELCOME_TITLE = 'Welcome to Sereleum!';

export const ONBOARDING_WELCOME_MESSAGE = 'To receive the best possible service, please fill out this short form. It takes less than a minute.';

export const onboardingQuestions: TQuestion<OnboardingAnswers>[] = [
  {
    question: "Company / Organization Size",
    options: ["1–10", "11–50", "51–200", "201–1000", "1000+"],
    questionCategory: 'companySize',
    allowMultipleAnswers: false,
  },
  {
    question: "Industry / Sector",
    questionCategory: 'industry',
    allowMultipleAnswers: false,
    isTextInput: true
  },
  {
    question: "How do you currently store or manage user prompts?",
    options: [
      "In a database",
      "In spreadsheets / CSVs",
      "In internal tools / dashboards",
      "Not stored / ad hoc",
      "Other"
    ],
    questionCategory: 'promptStorage',
    allowMultipleAnswers: false,
  },
  {
    question: "What is your main goal for using Sereleum?",
    options: [
      "Understanding user intent",
      "Optimizing prompts / system prompts",
      "Reducing LLM usage costs",
      "Discovering new use cases",
      "Other"
    ],
    questionCategory: 'usageGoals',
    allowMultipleAnswers: true,
  },
  {
    question: "Approximate volume of user prompts you handle per month",
    options: ["<500", "500–2,000", "2,000–5,000", "5,000+"],
    questionCategory: 'promptVolume',
    allowMultipleAnswers: false,
  },
];