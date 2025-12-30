import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "./db";
import { recipes } from "./db/schema";
import { parseRecipe } from "./features/recipes/utils";

const dir = "./seed";
const files = await readdir(dir);

const user = await db.query.user.findFirst();
if (!user) {
	throw new Error("User not found");
}

for (const file of files) {
	if (file.startsWith(".")) continue;

	const filePath = join(dir, file);
	const contents = await readFile(filePath, "utf8");

	const r = parseRecipe(contents);

	await db.insert(recipes).values({
		text: contents,
		title: r.name,
		type: "meal",
		userId: user.id,
	});
}

await db.$client.end();
