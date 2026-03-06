'use server'
import { Notify } from 'notify-utils';
import { ContactFormSchema } from '@/app/schemas/contact';
import { ContactState } from '@/app/types';

declare global{
  var notifier: Notify | null;
}

let cached = global.notifier;
if (!cached) {
  cached = global.notifier = null;
};

const NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN!,
      options: { polling: false },
    },
}

const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID;

function getNotifier(){
  if(cached) return cached
  cached = global.notifier = new Notify(NOTIFICATIONS_CONFIG)
  return cached
}

export async function notify(message: string){
  const notifier = getNotifier();
  return await notifier.broadcast([{telegramChatId: TELEGRAM_CHANNEL}], message)
}

export async function sendNotification(prevState: ContactState, formData: FormData) {
  const formResults = ContactFormSchema.safeParse({
    email: formData.get('email'),
    supportType: formData.get('support-type'),
    message: formData.get('message'),
  });

  if (!formResults.success) {
    return {
      errors: formResults.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const { supportType, email, message } = formResults.data;
    const formattedMsg = `Support Type: ${supportType}\nEmail: ${email}\nMessage: ${message}`
    const result = await notify(formattedMsg);

    if(result.error) throw result.error
    return {success:true}

  } catch (error: any) {
    console.error("Error in sendNotification:", error.message);
    return {success: false};
  }
}