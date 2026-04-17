// auth.ts
import NextAuth from "next-auth"
import Discord, { DiscordProfile } from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import processEnv from "../env"
import { prisma as db } from "@/libs/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Discord({
            clientId: processEnv.AUTH_DISCORD_ID,
            clientSecret: processEnv.AUTH_DISCORD_SECRET,
        }),
    ],
    callbacks: {
        // SECURITY: Only allow your specific Discord ID to sign in
        async signIn({ user, account, profile }) {

            const discordProfile = profile as DiscordProfile
            if (discordProfile?.id === process.env.MY_DISCORD_ID) {
                return true;
            }
            return false; // Deny everyone else
        },
        // Add user ID to the session object so tRPC can use it
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
})