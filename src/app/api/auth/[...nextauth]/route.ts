import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import processEnv from "../../../../../env";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/libs/prisma";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: processEnv.AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    providers: [
        DiscordProvider({
            clientId: processEnv.AUTH_DISCORD_CLIENT_ID,
            clientSecret: processEnv.AUTH_DISCORD_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("--- SIGN IN ATTEMPT ---");
            console.log("User Data:", user); // ID, Email, Name from your DB
            console.log("Discord Profile:", profile); // Raw data from Discord
            return true;
        },
        async jwt({ token, user }) {
            // When user first logs in, 'user' is available. 
            // We attach the id to the token.
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("--- CURRENT SESSION ---", session);
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };