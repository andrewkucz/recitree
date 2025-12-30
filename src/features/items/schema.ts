import z from "zod";

export const getStoreListItemsInput = z.object({ storeId: z.number() });

export const createStoreListItemSchema = z.object({
	text: z.string(),
	storeId: z.number(),
	shoppingNote: z.string().optional(),
});

export const editStoreListItemSchema = createStoreListItemSchema.extend({
	id: z.number(),
	checked: z.boolean(),
});
