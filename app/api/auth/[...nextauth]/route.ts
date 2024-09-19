import NextAuth from "next-auth";
import { authValues } from "@/lib/auth"; // Ensure this path matches where you define authValues

const handler = NextAuth(authValues);

export { handler as GET, handler as POST };
