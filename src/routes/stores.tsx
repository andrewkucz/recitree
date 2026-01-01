import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DialogDrawer } from "@/components/DialogDrawer";
import { ListItem } from "@/components/ListItem";
import { NavBackButton } from "@/components/NavBackButton";
import { PageLayout } from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	getSettingsQueryOptions,
	updateSettings,
} from "@/features/settings/data";
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
		await context.queryClient.ensureQueryData(getSettingsQueryOptions());
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

	const { data: userSettings } = useSuspenseQuery(getSettingsQueryOptions());
	const queryClient = useQueryClient();
	const { mutate: updateDefaultStore } = useMutation({
		mutationFn: (storeId: number) =>
			updateSettings({ data: { defaultStore: storeId } }),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: getSettingsQueryOptions().queryKey,
			});
		},
	});

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
					<ListItem
						key={store.id}
						id={store.id}
						actions={[
							{
								label: "Set as default",
								action: () => updateDefaultStore(store.id),
								disabled: store.id === userSettings.defaultStore,
							},
						]}
					>
						<div>{store.name}</div>
						{store.id === userSettings.defaultStore ? (
							<Badge variant="secondary">Default</Badge>
						) : null}
					</ListItem>
				))}
			</div>
		</PageLayout>
	);
}
