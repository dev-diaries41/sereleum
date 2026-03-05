'use server'
import { Notify } from 'notify-utils';
import { ContactFormSchema } from '@/app/schemas/contact';
import { ContactState } from '@/app/types';

export const NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      options: { polling: false },
    },
}

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
    const result = await notify.broadcast([{discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL}], formattedMsg)

    return result.success? {message: 'MESSAGE SENT'} : {message: 'MESSAGE FAILED'};

  } catch (error: any) {
    console.error("Error in sendNotification:", error.message);
    return {message: 'MESSAGE FAILED'};
  }
}