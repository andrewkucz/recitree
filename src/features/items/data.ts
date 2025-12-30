import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { storeListItem } from "@/db/schema";
import { authApiMiddleware } from "@/middleware/auth";
import {
	createStoreListItemSchema,
	editStoreListItemSchema,
	getStoreListItemsInput,
} from "./schema";

export const getStoreListItems = createServerFn({
	method: "GET",
})
	.middleware([authApiMiddleware])
	.inputValidator(getStoreListItemsInput)
	.handler(async ({ context, data: { storeId } }) => {
		const { userId } = context;

		const store = await db.query.stores.findFirst({
			where: (f, { eq, and }) => and(eq(f.userId, userId), eq(f.id, storeId)),
		});
		if (!store) throw new Error("Store not found");

		return db.query.storeListItem.findMany({
			where: (f, { eq }) => eq(f.storeId, storeId),
			orderBy: (f, { asc }) => asc(f.text),
		});
	});

export const getStoreListItemsQueryOptions = (
	store: { id: number } | undefined,
) =>
	queryOptions({
		queryKey: ["store-items", store],
		queryFn: () =>
			getStoreListItems({ data: { storeId: store?.id as number } }),
		enabled: !!store,
	});

export type StoreListItem = Awaited<
	ReturnType<typeof getStoreListItems>
>[number];

export const createStoreListItem = createServerFn({
	method: "POST",
})
	.middleware([authApiMiddleware])
	.inputValidator(createStoreListItemSchema)
	.handler(
		async ({ context: { userId }, data: { text, storeId, shoppingNote } }) => {
			const store = await db.query.stores.findFirst({
				where: (f, { eq, and }) => and(eq(f.userId, userId), eq(f.id, storeId)),
			});
			if (!store) throw new Error("Store not found");

			await db.insert(storeListItem).values({
				storeId,
				text,
				shoppingNote,
			});

			return true;
		},
	);

export const editStoreListItem = createServerFn({
	method: "POST",
})
	.middleware([authApiMiddleware])
	.inputValidator(editStoreListItemSchema)
	.handler(
		async ({
			context: { userId },
			data: { text, storeId, shoppingNote, id, checked },
		}) => {
			const ogItem = await db.query.storeListItem.findFirst({
				where: (f, { eq }) => eq(f.id, id),
			});
			if (!ogItem) throw new Error("List item not found");

			const ogItemStore = await db.query.stores.findFirst({
				where: (f, { eq }) => eq(f.id, ogItem.storeId),
			});
			if (!ogItemStore || ogItemStore.userId !== userId)
				throw new Error("Store not found");

			await db
				.update(storeListItem)
				.set({
					text,
					shoppingNote,
					storeId,
					checked,
				})
				.where(eq(storeListItem.id, id));

			return true;
		},
	);

export const deleteStoreListItem = createServerFn({
	method: "POST",
})
	.middleware([authApiMiddleware])
	.inputValidator(z.object({ id: z.number() }))
	.handler(async ({ context: { userId }, data: { id } }) => {
		const ogItem = await db.query.storeListItem.findFirst({
			where: (f, { eq }) => eq(f.id, id),
		});
		if (!ogItem) throw new Error("List item not found");

		const ogItemStore = await db.query.stores.findFirst({
			where: (f, { eq }) => eq(f.id, ogItem.storeId),
		});
		if (!ogItemStore || ogItemStore.userId !== userId)
			throw new Error("Store not found");

		await db.delete(storeListItem).where(eq(storeListItem.id, id));

		return true;
	});
