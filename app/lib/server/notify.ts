'use server'
import { Notify } from 'notify-utils';
import { ContactFormSchema } from '@/app/schemas/contact';
import { ContactState } from '@/app/types';

const NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN!,
      options: { polling: false },
    },
}

const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID

export async function sendNotification(prevState: ContactState, formData: FormData) {
  const notify = new Notify(NOTIFICATIONS_CONFIG)
  const formResults = ContactFormSchema.safeParse({
    email: formData.get('email'),
    supportType: formData.get('support-type'),
    message: formData.get('message'),
  });

  if (!formResults.success) {
    return {
      errors: formResults.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to send email.',
    };
  }

  try {
    const { supportType, email, message } = formResults.data;
    const formattedMsg = `Support Type: ${supportType}\nEmail: ${email}\nMessage: ${message}`
    const result = await notify.broadcast([{telegramChatId: TELEGRAM_CHANNEL}], formattedMsg)

    if(result.error) throw result.error

  } catch (error: any) {
    console.error("Error in sendNotification:", error.message);
    return {message: 'Error sending notification'};
  }
}