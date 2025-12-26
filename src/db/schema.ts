import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const stores = pgTable("store", {
	id: serial().primaryKey(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const ingredients = pgTable("ingredient", {
	id: serial().primaryKey(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const recipes = pgTable("recipe", {
	id: serial().primaryKey(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: text().notNull(),
	text: text().notNull(),
});

export const mealPlanRecipe = pgTable("meal_plan_recipe", {
	userId: text()
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	recipeId: integer().references(() => recipes.id, { onDelete: "cascade" }),
});

export const storeListItem = pgTable("store_list_item", {
	id: serial().primaryKey(),
	storeId: integer()
		.notNull()
		.references(() => stores.id, { onDelete: "cascade" }),
	text: text().notNull(),
	ingredientId: integer().references(() => ingredients.id, {
		onDelete: "cascade",
	}),
});
