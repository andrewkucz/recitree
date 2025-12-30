import { marked } from "marked";

type RecipeItem = {
	name: string;
	amount: string | undefined;
	prep: string | undefined;
};

export function parseRecipe(text: string) {
	let name: string | undefined;

	const items: RecipeItem[] = [];

	marked.parse(text, {
		walkTokens(token) {
			if (token.type === "heading" && token.depth === 1 && !name) {
				name = token.text;
			}
			if (token.type === "list_item" && !token.task) {
				const [name, amount, prep] = token.text.trim().split(/\s*\|\s*/);

				if (!name) {
					throw new Error("Item name not found");
				}

				items.push({
					name,
					amount,
					prep,
				});
			}
		},
	});

	if (!name) {
		throw new Error("No main heading found");
	}

	return { name, items };
}
