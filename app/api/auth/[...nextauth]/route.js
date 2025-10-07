import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../config/db";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
          // Allow all users
          return true;
        },
        async session({ session, user }) {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                });
            session.user.id = user.id;
            session.user.spotifyToken = dbUser?.spotifyToken || null; 
            session.user.spotifyTokenExpiry = dbUser?.spotifyTokenExpiry || null;
            return session;
        },
    },
    session: {
        strategy: "database",
      },
    cookies: {
        sessionToken: {
          name: "next-auth.session-token",
          options: {
            httpOnly: true,
            sameSite: "lax", // Use "lax" for cross-origin GET requests
            path: "/",
            secure: true, 
          },
        },
      },
    pages: {
        error: '/login',
    }, 
    // events: {
    //     error(message) {
    //         console.error("NextAuth error:", message); 
    //     },
    // },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };