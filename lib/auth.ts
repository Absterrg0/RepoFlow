import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import client from '@/db'

export const authValues: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const username = profile.name as string;

        // Fetch user details from the database
        const dbUser = await client.user.findUnique({
          where: { username: username },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.isAdmin = dbUser.isAdmin;
        } else {
          // If the user doesn't exist, create a new user in the database
          const newUser = await client.user.create({
            data: {
              username: username, 
              // You may want to set other fields or handle defaults here
            },
          });

          token.id = newUser.id;
          token.username = newUser.username;
          token.isAdmin = newUser.isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as number,
          username: token.username as string,
          isAdmin: token.isAdmin as boolean,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authValues;
