import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number;
    username: string;
    isAdmin?: boolean;  // Optional if you want to make it non-mandatory
  }

  interface Session {
    user: {
      id: number;
      username: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id: number;
    username: string;
    isAdmin?: boolean;  // Optional if you want to make it non-mandatory
  }
}
