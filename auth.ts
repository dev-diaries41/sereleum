import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUser } from './app/lib/server/data/user';
import { hashPassword } from './app/lib/server/cryptography';
import { User } from './app/types';

 
export const { auth, signIn, signOut , handlers, unstable_update} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const verifyPassword = (storedHashedPassword: string, salt: string, inputPassword: string) => hashPassword(inputPassword, salt) === storedHashedPassword;
          const isValidPassword = verifyPassword(user.hashedPassword, user.salt, password);
          if (isValidPassword) return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.credits = user.credits;

        if (user.metadata) {
          token.metadata = user.metadata;
        }
      }
      if (trigger === "update" && session) {
        token = {...token, ...session}
        return token;
      };
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as User['id'];
        session.user.name = token.name as User['name'];
        session.user.email = token.email as User['email'];
        session.user.credits = token.credits as User['credits'];
        session.user.metadata = token.metadata as User['metadata'];
      }
      return session;
    },
  },
});