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

export const items = pgTable("items", {
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
	usualStoreId: integer().references(() => stores.id, { onDelete: "set null" }),
});

export const recipes = pgTable("recipe", {
	id: serial().primaryKey(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: text().notNull(),
	text: text().notNull(),
	type: text({ enum: ["recurring", "list", "recipe"] })
		.notNull()
		.default("recipe"),
});

export const mealPlanEntry = pgTable("meal_plan_entry", {
	id: serial().primaryKey(),
	userId: text().references(() => user.id, { onDelete: "cascade" }),
	recipeId: integer().references(() => recipes.id, { onDelete: "cascade" }),
	sideItem: integer().references(() => items.id, { onDelete: "set null" }),
});

export const storeListItem = pgTable("store_list_item", {
	id: serial().primaryKey(),
	storeId: integer()
		.notNull()
		.references(() => stores.id, { onDelete: "cascade" }),
	text: text().notNull(),
	shoppingNote: text(),
	itemId: integer().references(() => items.id, {
		onDelete: "set null",
	}),
});
