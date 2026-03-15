'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/server/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import CircleLoadingIndicator from '@/app/ui/utilities/circle-loading-indicator';
import { useActionState } from 'react';
import Logo from '../logo';


export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <div className="bg-white/70 shadow-2xl rounded-2xl p-8 border border-gray-200">
          <div className="flex flex-col items-center mb-6 gap-8">
            <Logo name="Sereleum" width={24} height={32} src={'/sereleum-infinity-logo.png'}/>
            <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          </div>

          <form action={dispatch} className="flex flex-col gap-5" aria-describedby={errorMessage ? 'login-error' : undefined}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>

              {/* <p className="my-4 mb-0">
                <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:underline text-sm">Forgot password?</Link>
              </p> */}
            </div>

            <LoginButton />

            <p className="text-sm text-center">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:underline">Sign Up</Link>
            </p>

            <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    key="login-error"
                    id="login-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center text-sm text-red-600"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 mr-2 text-red-500" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-2 w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md"
      aria-disabled={pending}
      disabled={pending}
    >
      {'Continue'}
      {pending && <CircleLoadingIndicator size={20} />}
    </button>
  );
}