import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { authApiMiddleware } from "@/middleware/auth";

const getRecipes = createServerFn({
	method: "GET",
})
	.middleware([authApiMiddleware])
	.handler(async ({ context }) => {
		const { userId } = context;
		return db.query.recipes.findMany({
			where: (fields, { eq }) => eq(fields.userId, userId),
		});
	});

export const getRecipesQueryOptions = () =>
	queryOptions({
		queryKey: ["recipes"],
		queryFn: () => getRecipes(),
	});

export type Recipe = Awaited<ReturnType<typeof getRecipes>>[number];

// export const createStore = createServerFn({
// 	method: "POST",
// })
// 	.middleware([authApiMiddleware])
// 	.inputValidator(createStoreSchema)
// 	.handler(async ({ context, data: { name } }) => {
// 		const { userId } = context;
// 		const [store] = await db
// 			.insert(stores)
// 			.values({
// 				userId,
// 				name,
// 			})
// 			.returning();
// 		return store;
// 	});
