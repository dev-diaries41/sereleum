'use client'

import { useActionState, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputError from '../common/form-error'
import { sendNotification } from '@/app/lib/server/notify'
import { useFormStatus } from 'react-dom'
import CircleLoadingIndicator from '@/app/ui/utilities/circle-loading-indicator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const supportOptions: { value: string; name: string }[] = [
  { name: 'Select Type', value: '' },
  { name: 'Issue', value: 'issues' },
  { name: 'Feature request', value: 'feature-request' },
]
const CONFIRMATION_MESSAGE_SOLO = "I’ve received your message and will reply to your email as soon as possible."
const SUPPORT_INFO = "Have a question or request? Send a message and you’ll receive a reply as soon as possible."
const CONFIRMATION_MESSAGE = " Your message has been successfully delivered to our support team. We’ll review it and respond to your email shortly."

export default function ContactForm() {
  const initialState = { success: false, errors: {} }
  const [state, dispatch] = useActionState(sendNotification, initialState)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (state.success) {
      setIsSubmitted(true)
    }
  }, [state])

  return (
    <div className="relative flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-3">
              Contact
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              {SUPPORT_INFO}
            </p>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-600">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Typical response time: 24-72 hours</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                action={dispatch}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-5"
              >

                {/* Type */}
                <div className="relative">
                  <InputError id="support-type-error" state={state} inputName={'support-type'} />
                  <label htmlFor="support-type" className="mb-2 block text-sm font-medium">
                    Type
                  </label>

                  <select
                    id="support-type"
                    name="support-type"
                    className="peer block w-full cursor-pointer border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-describedby="support-type-error"
                  >
                    {supportOptions.map((option, index) => (
                      <option key={index.toString()} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className="relative">
                  <InputError id="email-error" state={state} inputName={'email'} />
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="text"
                    id="email"
                    name="email"
                    defaultValue=""
                    placeholder="Email address"
                    aria-describedby="email-error"
                    className="peer block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <InputError id="message-error" state={state} inputName={'message'} />
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    maxLength={500}
                    defaultValue=""
                    placeholder="Enter message..."
                    aria-describedby="message-error"
                    className="peer block w-full border border-gray-300 min-h-40 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <SubmitButton />
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
                  className="mb-4"
                >
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 text-4xl"
                  />
                </motion.div>

                <h2 className="text-lg font-semibold mb-2">
                  Message Sent
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                 {CONFIRMATION_MESSAGE_SOLO}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="mt-2 w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
      aria-disabled={pending}
      disabled={pending}
    >
      Send Message
      {pending && <CircleLoadingIndicator size={20} />}
    </button>
  )
}