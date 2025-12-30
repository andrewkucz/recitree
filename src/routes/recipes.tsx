import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ActionsMenu } from "@/components/ActionsMenu";
import { ListItem } from "@/components/ListItem";
import { NavBackButton } from "@/components/NavBackButton";
import { PageLayout } from "@/components/PageLayout";
import { getRecipesQueryOptions, type Recipe } from "@/features/recipes/data";
import { authPageMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/recipes")({
	component: Recipes,
	server: {
		middleware: [authPageMiddleware],
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getRecipesQueryOptions());
	},
});

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	return (
		<ListItem
			id={recipe.id}
			actions={[
				{
					label: "Add to meal plan",
					action: () => {},
				},
			]}
		>
			{recipe.title}
		</ListItem>
	);
}

function Recipes() {
	const { data } = useSuspenseQuery(getRecipesQueryOptions());

	return (
		<PageLayout
			title="Recipes"
			header={
				<>
					<NavBackButton />
					<ActionsMenu />
				</>
			}
		>
			<div className="space-y-3">
				{data.map((d) => (
					<RecipeListItem key={d.id} recipe={d} />
				))}
			</div>
		</PageLayout>
	);
}
