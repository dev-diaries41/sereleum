import { z } from 'zod';

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
  