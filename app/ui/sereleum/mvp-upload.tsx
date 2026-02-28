'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faFileLines,
  faClose,
  faEnvelope,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../common/upload';
import { AcceptedMimes } from '@/app/constants/global';
import { InlinePopUp } from '../common/inline-popup';
import useOnboarding from '@/app/hooks/useOnboarding';
import { Questionnaire } from '../onboarding/questionnaire';
import {
  ONBOARDING_WELCOME_MESSAGE,
  ONBOARDING_WELCOME_TITLE,
  onboardingQuestions
} from '@/app/constants/content/onboarding';
import { useState } from 'react';
import { upload } from '@/app/lib/server/cloudinary';
import LoadingIndicator from '../utilities/circle-loading-indicator';
import { PromptArraySchema } from '@/app/schemas/prompt';
import { User } from '@/app/types';

interface DashboardOverviewProps {
  user?: Partial<User>;
  hasCompletedOnboarding?: boolean;
}

const PROMPTS_LIMIT = 1000

export function MVPDashboard({ user, hasCompletedOnboarding }: DashboardOverviewProps) {
  const { isVisible, isOnboarded, onCompleteOnboarding } = useOnboarding(user!!.email);

  const [promptsFile, setPromptsFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const  fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('FileReader result is not a string'));
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // Only for mvp since limited to 1000 prompts. For large json files streaming required
  const validatePromptsFile = async(file: File) => {
    const text = await file.text(); 
    const parsed = JSON.parse(text);

    if (parsed.length > PROMPTS_LIMIT) throw new Error("Prompts limit exceeded")

    const result = PromptArraySchema.safeParse(parsed);

    if (!result.success) {
      throw result.error;
    }

    return result.data; 
  }

  const handleFileUpload = async () => {
    if (!promptsFile) return;

    setLoading(true)

    try {
      await validatePromptsFile(promptsFile);

      const base64 = await fileToBase64(promptsFile)
      const folder = `prompts_${user!!.id}`
      const url = await upload(base64, {folder: folder, type: "private"})

      setPromptsFile(null);
      setIsSubmitted(true);
    }catch(error){
      setError("Error uploading file")
      console.error(error)
    }
    finally{
      setLoading(false)
    }
  };

  const updatePromptsFile = (file: File | null) => setPromptsFile(file);
  const resetError = () => setError(null);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">

      {( !hasCompletedOnboarding && isVisible && !isOnboarded ) && (
        <Questionnaire
          onComplete={onCompleteOnboarding}
          onboardingQuestions={onboardingQuestions}
          welcomeMessage={ONBOARDING_WELCOME_MESSAGE}
          welcomeTitle={ONBOARDING_WELCOME_TITLE}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-3">
              Upload Your Prompts File
            </h1>
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                <p>
                    Upload a JSON export of your prompts to receive a free insights report.
                    The report will highlight dominant user intents and where token usage concentrates.
                </p>

                <p className="font-semibold">
                    Maximum 10,000 prompts per upload.
                    <span className="block text-xs text-gray-500 font-normal">
                    (Limit applies to the free report only.)
                    </span>
                </p>

                <p className="font-semibold">
                Required format for each prompt:
                <span className="block font-normal mt-1">
                    <span className="font-mono">id: string</span> and{" "}
                    <span className="font-mono">data: string</span>
                </span>
                <span className="block font-normal text-xs text-gray-500 mt-1">
                    <span className="font-mono">data</span> contains the full prompt content.
                </span>
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-600">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>You’ll receive your report via email within 24–48 hours.</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">

            <AnimatePresence mode="wait">

              {!isSubmitted ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full"
                >

                  {!promptsFile ? (
                    <FileUploader
                      onFileUpload={(files) => updatePromptsFile(files[0])}
                      acceptedMimes={AcceptedMimes}
                    >
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full border-2 border-dashed border-indigo-300 rounded-xl p-10 text-center cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50"
                      >
                        <FontAwesomeIcon
                          icon={faUpload}
                          className="text-indigo-600 text-3xl mb-4"
                        />
                        <p className="text-sm text-gray-700 font-medium">
                          Click to upload your JSON prompts file
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported format: .json
                        </p>
                      </motion.div>
                    </FileUploader>
                  ) : (
                    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-6 flex flex-col items-center text-center gap-4">
                      <FontAwesomeIcon
                        icon={faFileLines}
                        className="text-indigo-600 text-3xl"
                      />

                      <p className="text-sm font-medium text-gray-800">
                        {promptsFile.name}
                      </p>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleFileUpload}
                          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 transition items-center flex gap-2"
                        >
                          Submit File
                         {loading && <LoadingIndicator size={18}/>}
                        </button>

                        <button
                          onClick={() => updatePromptsFile(null)}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faClose} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8 text-center shadow-inner"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="mb-4"
                  >
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-green-500 text-4xl"
                    />
                  </motion.div>

                <h2 className="text-lg font-semibold mb-2">
                    Report on the Way
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                    Your prompts have been successfully submitted.
                    We’re analyzing your dominant workflows and token usage.
                    You’ll receive your free insights report at{" "}
                    <span className="font-medium text-gray-800">{user!!.email}</span>{" "}
                    within 24–48 hours.
                </p>
                </motion.div>
              )}

            </AnimatePresence>

            {error && (
              <div className="mt-6 w-full">
                <InlinePopUp
                  description={error}
                  isError={true}
                  onClose={resetError}
                />
              </div>
            )}
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
            Your data is used solely to generate your report. No prompts are shared
            or stored beyond analysis.
          </div>

        </div>
      </motion.div>
    </div>
  );
}