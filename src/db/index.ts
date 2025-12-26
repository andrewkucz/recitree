import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env";
import * as authSchema from "./auth-schema";
import * as dataSchema from "./schema";

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		...dataSchema,
		...authSchema,
	},
});
