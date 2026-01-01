import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { userSetting } from "@/db/schema";
import { authApiMiddleware } from "@/middleware/auth";
import { settingsSchema } from "./schema";

const getSettings = createServerFn({
	method: "GET",
})
	.middleware([authApiMiddleware])
	.handler(async ({ context }) => {
		const { userId } = context;
		const settings = await db.query.userSetting.findFirst({
			where: (fields, { eq }) => eq(fields.userId, userId),
		});

		if (!settings) {
			return {
				userId,
				defaultStore: null,
			};
		}
		return settings;
	});

export const getSettingsQueryOptions = () =>
	queryOptions({
		queryKey: ["settings"],
		queryFn: () => getSettings(),
	});

export type UserSettings = Awaited<ReturnType<typeof getSettings>>[number];

export const updateSettings = createServerFn({
	method: "POST",
})
	.middleware([authApiMiddleware])
	.inputValidator(settingsSchema)
	.handler(async ({ context, data }) => {
		const { userId } = context;

		const { defaultStore } = data;
		if (defaultStore) {
			const store = await db.query.stores.findFirst({
				where: (f, { eq, and }) =>
					and(eq(f.userId, userId), eq(f.id, defaultStore)),
			});
			if (!store) throw new Error("Store not found");
		}

		const [settings] = await db
			.insert(userSetting)
			.values({
				userId,
				...data,
			})
			.onConflictDoUpdate({
				set: data,
				target: userSetting.userId,
			})
			.returning();
		return settings;
	});
