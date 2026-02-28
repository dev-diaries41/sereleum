import NextAuth from 'next-auth';
import {User as SereleumUser} from '@/app/types'

declare module 'next-auth' {
  interface User  extends Omit<SereleumUser, 'salt' | 'hashedPassword'>{}

  interface Session {
    user: User; // user properties are included in the session
  }
}
