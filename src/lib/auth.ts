import { getRequestHeaders } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [tanstackStartCookies()],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		},
	},
});

export const getSession = async () => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });
	return session;
};
