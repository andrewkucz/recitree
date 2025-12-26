import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "../lib/auth";

export const authPageMiddleware = createMiddleware().server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		if (!session) {
			throw redirect({ to: "/login" });
		}
		return next({
			context: {
				session,
			},
		});
	},
);

export const unauthPageMiddleware = createMiddleware().server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		if (session) {
			throw redirect({ to: "/" });
		}
		return next();
	},
);

export const authApiMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;
	return next({
		context: {
			userId,
			...session,
		},
	});
});
