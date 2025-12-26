import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { authApiMiddleware } from "@/middleware/auth";
import { createStoreSchema } from "./schema";

const getStores = createServerFn({
	method: "GET",
})
	.middleware([authApiMiddleware])
	.handler(async ({ context }) => {
		const { userId } = context;
		return db.query.stores.findMany({
			where: (fields, { eq }) => eq(fields.userId, userId),
		});
	});

export const getStoresQueryOptions = () =>
	queryOptions({
		queryKey: ["stores"],
		queryFn: () => getStores(),
	});

export type Store = Awaited<ReturnType<typeof getStores>>[number];

export const createStore = createServerFn({
	method: "POST",
})
	.middleware([authApiMiddleware])
	.inputValidator(createStoreSchema)
	.handler(async ({ context, data: { name } }) => {
		const { userId } = context;
		const [store] = await db
			.insert(stores)
			.values({
				userId,
				name,
			})
			.returning();
		return store;
	});
