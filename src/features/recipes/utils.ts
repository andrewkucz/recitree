import { marked } from "marked";

type RecipeIngredient = {
	name: string;
	amount: string | undefined;
	prep: string | undefined;
};

export function parseRecipe(text: string) {
	let name: string | undefined;

	const ingredients: RecipeIngredient[] = [];

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
				ingredients.push({
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

	const items = [...new Set(ingredients.map((i) => i.name)).values()].map(
		(name, id) => ({ id, name }),
	);

	return { name, ingredients, items };
}
