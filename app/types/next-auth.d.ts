import NextAuth from 'next-auth';
import {User as ImagicUser} from '@/app/types'

declare module 'next-auth' {
  interface User  extends Omit<ImagicUser, 'salt' | 'hashedPassword'>{
    id?: string; // Optional id if needed for type compatibility (surpress authorize in ./auth.ts)
  }

  interface Session {
    user: User; // Ensure your custom user properties are included in the session
  }
}
