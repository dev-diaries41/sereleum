'use client'
import { useActionState, useEffect } from 'react';
import InputError from '../common/form-error';
import { sendNotification } from '@/app/lib/server/notify';
import { useFormStatus } from 'react-dom';
import CircleLoadingIndicator from '@/app/ui/utilities/circle-loading-indicator';

const supportOptions: {value:string, name: string}[] = [
  {
    name: 'Select Type',
    value: ''
  },
  {
    name: 'Issues',
    value: 'issues'
  },
  {
    name: 'Feature request',
    value: 'feature-request'
  }
]

export default function ContactForm(){
  const initialState = { success: false, errors: {}};
  const [state, dispatch] = useActionState(sendNotification, initialState);

  useEffect(() => {
    if(state.success){
      alert('Message sent');
    }
  }, [state])

  return (
    <form action={dispatch} className='w-full'>
      <div className="flex flex-col gap-4 w-full">
      <div className="relative">
          <InputError id='support-type-error' state={state} inputName={'support-type'} />
          <label htmlFor="support-type" className='mb-2 block text-sm font-medium'>Type:</label>
          <select
            id="support-type"
            name="support-type"
            className="peer block w-full cursor-pointer border-2 border-gray-500 p-2 rounded-md"
            aria-describedby="support-type-error"
          >
            {
              supportOptions.map((option, index) => {
                return(
                  <option key={index.toString()} className='' value={option.value}>{option.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="relative">
          <InputError id='email-error' state={state} inputName={'email'} />
          <label htmlFor="email" className='mb-2 block text-sm font-medium'>Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue=""
            className="peer block w-full cursor-pointer border-2 border-gray-500 p-2 rounded-md"
            placeholder='johndoe@example.com'
            aria-describedby="email-error"
          />
        </div>

        <div className="relative">
          <InputError id='message-error' state={state} inputName={'message'} />
          <label htmlFor="message" className='mb-2 block text-sm font-medium'>Message:</label>
          <textarea
            id="message"
            name="message"
            className="peer block w-full cursor-pointer mb-4 border-2 border-gray-500 min-h-40 max-h-full flex-grow p-2 rounded-md"
            maxLength={500}
            defaultValue=""
            placeholder='Enter message...'
            aria-describedby="message-error"
          />
        </div>
        <div className='flex justify-center ml-auto w-[100%] lg:w-[25%] '>
        <SubmitButton/>
        </div>
      </div>
    </form>
  );
};



function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit"
            className="mt-4 w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg"
            aria-disabled={pending}
            disabled={pending}
        >
            {'Send Message'} 
            {pending && <CircleLoadingIndicator size={20} />}
        </button>
    );
}
