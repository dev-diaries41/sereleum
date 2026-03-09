'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { sendPasswordResetEmail } from '@/app/lib/server/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleLoadingIndicator from '@/app/ui/utilities/circle-loading-indicator';
import InputError from '../common/form-error';
import { useSearchParams } from 'next/navigation';

export default function ForgotPasswordForm() {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(sendPasswordResetEmail, initialState);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="relative flex justify-center p-4">
      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Reset your password</h1>
          </div>

          <motion.form
            key="form"
            action={dispatch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-4"
          >
            {(state.message && state.message !== 'Something went wrong.') && (
              <motion.p
                key="success-message"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="opacity-80 break-words my-4 text-sm"
              >
                {state.message}
              </motion.p>
            )}

            {error && (
              <motion.div
                key="query-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
                aria-live="polite"
              >
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            <div className="relative">
              <InputError id="email-error" state={state} inputName={'email'} />
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="email"
                type="email"
                name="email"
                aria-describedby="email-error"
                placeholder="Enter email address"
                required
              />
            </div>

            <SubmitButton />

            {state.message === 'Something went wrong.' && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
                aria-live="polite"
              >
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{state.message}</p>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-4 w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
      aria-disabled={pending}
      disabled={pending}
    >
      {'Continue'}
      {pending && <CircleLoadingIndicator size={20} />}
    </button>
  );
}