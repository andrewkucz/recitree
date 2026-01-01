import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ActionsMenu } from "@/components/ActionsMenu";
import { DialogDrawer } from "@/components/DialogDrawer";
import { ListItem } from "@/components/ListItem";
import { NavBackButton } from "@/components/NavBackButton";
import { PageLayout } from "@/components/PageLayout";
import { getRecipesQueryOptions, type Recipe } from "@/features/recipes/data";
import { parseRecipe } from "@/features/recipes/utils";
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

function AddToMealPlanForm({ recipe }: { recipe: Recipe }) {
	const [selected, setSelected] = useState({} as Record<number, boolean>);

	const { name, items } = useMemo(
		() => parseRecipe(recipe.text),
		[recipe.text],
	);

	return (
		<div>
			<div className="space-y-3">
				{items.map((item) => (
					<ListItem
						id={item.id}
						key={item.name}
						checked={!!selected[item.id]}
						onCheckedChange={(newVal) =>
							setSelected((prev) => ({ ...prev, [item.id]: newVal }))
						}
					>
						{item.name}
					</ListItem>
				))}
			</div>
		</div>
	);
}

function Recipes() {
	const [{ open, selected }, setDialog] = useState({
		open: false,
		selected: null as Recipe | null,
	});
	const onOpenChange = (open: boolean) => {
		setDialog((prev) => ({ ...prev, open }));
	};

	const handleAddToMealPlan = (selected: Recipe) => {
		setDialog({ selected, open: true });
	};

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
					<ListItem
						key={d.id}
						id={d.id}
						actions={[
							{
								label: "Add to meal plan",
								action: () => handleAddToMealPlan(d),
							},
						]}
					>
						{d.title}
					</ListItem>
				))}
			</div>
			<DialogDrawer
				open={open}
				onOpenChange={onOpenChange}
				title={selected?.title ?? "Add to meal plan"}
				content={selected ? <AddToMealPlanForm recipe={selected} /> : null}
			/>
		</PageLayout>
	);
}
