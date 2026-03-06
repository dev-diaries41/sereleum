'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { register } from '@/app/lib/server/auth';
import InputError from '@/app/ui/common/form-error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { REGISTRATION_SUCCESS } from '@/app/constants/account';
import CircleLoadingIndicator from '@/app/ui/utilities/circle-loading-indicator';
import Logo from '../logo';

export default function RegistrationForom() {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(register, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === REGISTRATION_SUCCESS) {
      setTimeout(() => router.push('/login'), 1000);
    }
  }, [state, router]);

  const isSuccess = state.message === REGISTRATION_SUCCESS;

  return (
    <div className="relative flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
          <div className="flex flex-col items-center mb-6 gap-8">
            <Logo name="Sereleum" width={80} height={80} src={'/sereleum-infinity-logo.png'}/>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                action={dispatch}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-4"
              >
                {/* Top message (success/error) */}
                {state.message && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2 rounded-md"
                    aria-live="polite"
                  >
                    <FontAwesomeIcon
                      icon={state.message === REGISTRATION_SUCCESS ? faCheckCircle : faExclamationCircle}
                      className={`h-5 w-5 ${state.message === REGISTRATION_SUCCESS ? 'text-emerald-500' : 'text-red-500'}`}
                    />
                    <p className="text-sm opacity-80">{state.message}</p>
                  </motion.div>
                )}

                <div className="relative">
                  <InputError id="email-error" state={state} inputName={'email'} />
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    defaultValue=""
                    className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email address"
                    aria-describedby="email-error"
                    required
                  />
                </div>

                <div className="relative">
                  <InputError id="password-error" state={state} inputName={'password'} />
                  <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                    placeholder="Enter password"
                    aria-describedby="password-error"
                    required
                  />
                </div>

                <div className="relative">
                  <InputError id="confirm-password-error" state={state} inputName={'confirm-password'} />
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">Confirm password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                    placeholder="Confirm your password"
                    aria-describedby="confirm-password-error"
                    required
                  />
                </div>

                <p className="text-center my-2 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-600 hover:underline font-semibold">Sign in</Link>
                </p>

                <div className="flex justify-center w-full">
                  <RegisterButton />
                </div>
              </motion.form>
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
                  className="mb-4 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
                </motion.div>

                <h2 className="text-lg font-semibold mb-2">Registration Complete</h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {state.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-4 w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md"
      aria-disabled={pending}
      disabled={pending}
    >
      {'Continue'}
      {pending && <CircleLoadingIndicator size={20} />}
    </button>
  );
}