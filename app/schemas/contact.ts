import {z} from "zod"

export const ContactFormSchema = z.object({
    email: z.string({
      invalid_type_error: 'Please enter a valid email.',
    }).refine(
      (email) => email !== '',
      { message: 'Email cannot be empty.' }
    ),
    message: z.string({
      invalid_type_error: 'Please enter a valid message.',
    }).refine(
      (message) => message !== '',
      { message: 'Message cannot be empty.' }
    ),
    supportType: z.string({
      invalid_type_error: 'Please enter a valid name.',
    }).refine(
      (supportType) => supportType !== '',
      { message: 'Feedback type cannot be empty.' }
    ),
});

