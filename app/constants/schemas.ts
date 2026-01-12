import { z } from 'zod';

  export const ContactFormSchema = z.object({
    email: z.string({
      invalid_type_error: 'Please enter a valid email.',
    }).refine(
      (email) => email !== '',
      { message: 'Email cannot be empty.' }
    ),
    feedback: z.string({
      invalid_type_error: 'Please enter a valid message.',
    }).refine(
      (feedback) => feedback !== '',
      { message: 'Message cannot be empty.' }
    ),
    feedbackType: z.string({
      invalid_type_error: 'Please enter a valid name.',
    }).refine(
      (feedbackType) => feedbackType !== '',
      { message: 'Feedback type cannot be empty.' }
    ),
  });



  export const UserSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const RegistrationFormSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const CompletePasswordResetFormSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
  });

  export const ResetPasswordFormSchema = z.object({
    email: z.string()
      .email({ message: 'A valid email address is required.' })
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        { message: 'The email must follow the correct syntax (e.g., user@example.com).' }
      ),
  });
  
  
