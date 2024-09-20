import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number;
    username: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: number;
      username: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;  // Add accessToken to Session
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id: number;
    username: string;
    isAdmin?: boolean;
    accessToken?: string;  // Add accessToken to JWT
  }
}
