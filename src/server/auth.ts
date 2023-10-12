import DiscordProvider from '@auth/core/providers/discord';
import { SolidAuthConfig, getSession } from '@solid-mediakit/auth';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createServerData$ } from 'solid-start/server';

/* export const pgPool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "bank",
    password: "",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})
 */
export const prisma = new PrismaClient();

export const authOptions: SolidAuthConfig = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user && account) {
                console.log('jwt user', user);
                token.role = user.role;
                token.id = user.id;
                token.accessToken = account.access_token!!;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            console.log('session token', token);
            session.user.role = token.role;
            session.user.id = token.id;
            session.accessToken = token.accessToken;

            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
};

export const useSession = () => {
    return createServerData$(
        async (_, { request }) => {
            return await getSession(request, authOptions);
        },
        { key: () => ['auth_user'] }
    );
};
