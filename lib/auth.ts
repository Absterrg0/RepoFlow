import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import client from '@/db';

export const authValues: NextAuthOptions = {
  // Helps prevent "State cookie was missing" on some deployments/proxies.
  useSecureCookies: true,
  cookies: {
    state: {
      name: "__Secure-next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: "__Secure-next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: "__Secure-next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: "__Host-next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const ghProfile = profile as unknown as {
          login?: string;
          name?: string | null;
        };

        // GitHub `login` is stable + unique; `name` is optional and not unique.
        const username = ghProfile.login ?? token.sub ?? ghProfile.name ?? undefined;
        if (!username) return token;

        try {
          const dbUser = await client.user.upsert({
            where: { username },
            update: {},
            create: { username },
          });

          token.id = dbUser.id;
          token.username = dbUser.username;
          token.isAdmin = dbUser.isAdmin;
          token.accessToken = account.access_token;
        } catch (e) {
          // If DB operations fail, don't crash the OAuth callback.
          console.error("NextAuth jwt callback DB error:", e);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as number,
          username: token.username as string,
          isAdmin: token.isAdmin as boolean,
        };

        // Add accessToken to the session object
        session.accessToken = token.accessToken;
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
