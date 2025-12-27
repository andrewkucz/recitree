import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DialogDrawer } from "@/components/DialogDrawer";
import { NavBackButton } from "@/components/NavBackButton";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoreForm } from "@/features/stores/components/store-form";
import { createStore, getStoresQueryOptions } from "@/features/stores/data";
import { authPageMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/stores")({
	component: App,
	server: {
		middleware: [authPageMiddleware],
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getStoresQueryOptions());
	},
});

const AddStoreButton = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: createStore,
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: getStoresQueryOptions().queryKey,
			});
			setCreateDialogOpen(false);
		},
	});

	return (
		<DialogDrawer
			open={createDialogOpen}
			onOpenChange={setCreateDialogOpen}
			title="Create Store"
			content={
				<StoreForm onSubmit={(data) => mutation.mutateAsync({ data })} />
			}
		>
			<Button size="icon" variant="outline">
				<PlusIcon />
			</Button>
		</DialogDrawer>
	);
};

function App() {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());

	return (
		<PageLayout
			title="Stores"
			header={
				<>
					<NavBackButton />
					<AddStoreButton />
				</>
			}
		>
			<div className="space-y-3">
				{stores.map((store) => (
					<Card key={store.id} className="bg-background p-2 rounded-md">
						{store.name}
					</Card>
				))}
			</div>
		</PageLayout>
	);
}
