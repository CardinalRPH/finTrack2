import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import processEnv from "../../env";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: processEnv.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        DiscordProvider({
            clientId: processEnv.AUTH_DISCORD_CLIENT_ID,
            clientSecret: processEnv.AUTH_DISCORD_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};