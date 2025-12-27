import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	stripSearchParams,
} from "@tanstack/react-router";
import { PlusIcon, StoreIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import z from "zod";
import { DialogDrawer } from "@/components/DialogDrawer";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoreListItemForm } from "@/features/items/components/store-list-item-form";
import {
	createStoreListItem,
	getStoreListItemsQueryOptions,
} from "@/features/items/data";
import { getStoresQueryOptions, type Store } from "@/features/stores/data";
import { authPageMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/")({
	component: App,
	server: {
		middleware: [authPageMiddleware],
	},
	search: {
		middlewares: [stripSearchParams({ s: 0 })],
	},
	validateSearch: z.object({
		s: z.number().default(0),
	}),
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getStoresQueryOptions());
	},
});

function StoresMenu({
	stores,
	selected,
}: {
	stores: Store[];
	selected: number;
}) {
	const navigate = Route.useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="outline">
					<StoreIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuItem asChild>
					<Link to="/stores">Edit Stores & Lists</Link>
				</DropdownMenuItem>
				{stores.length > 0 ? <DropdownMenuSeparator /> : null}
				<DropdownMenuRadioGroup
					value={`${selected}`}
					onValueChange={(v) =>
						navigate({
							search: {
								s: Number.parseInt(v, 10),
							},
						})
					}
				>
					{stores.map((s, i) => (
						<DropdownMenuRadioItem value={`${i}`} key={s.id}>
							{s.name}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const AddItemButton = ({ storeId }: { storeId: number }) => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: createStoreListItem,
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: getStoreListItemsQueryOptions({ id: storeId }).queryKey,
			});
			setCreateDialogOpen(false);
		},
	});

	return (
		<DialogDrawer
			open={createDialogOpen}
			onOpenChange={setCreateDialogOpen}
			title="Add Item"
			content={
				<StoreListItemForm
					storeId={storeId}
					onSubmit={(data) => mutation.mutateAsync({ data })}
				/>
			}
		>
			<Button size="icon" className="fixed bottom-4 left-4">
				<PlusIcon />
			</Button>
		</DialogDrawer>
	);
};

export function ListItem({
	children,
	currentStore,
}: {
	children: React.ReactNode;
	currentStore: { id: number } | undefined;
}) {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild className="p-2 rounded-md">
				<Card>{children}</Card>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-52">
				<ContextMenuItem>Edit</ContextMenuItem>
				<ContextMenuItem variant="destructive">Delete</ContextMenuItem>
				<ContextMenuSub>
					<ContextMenuSubTrigger>Move to Store</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-44">
						{stores
							.filter((s) => s.id !== currentStore?.id)
							.map((store) => (
								<ContextMenuItem key={store.id}>{store.name}</ContextMenuItem>
							))}
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}

function App() {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());
	const { s } = Route.useSearch();

	const selectedStore = stores.at(s);

	const { data } = useQuery(getStoreListItemsQueryOptions(selectedStore));

	return (
		<PageLayout
			header={<StoresMenu stores={stores} selected={s} />}
			title={selectedStore?.name}
		>
			{data?.map((item) => (
				<ListItem key={item.id} currentStore={selectedStore}>
					{item.text}
				</ListItem>
			))}
			{selectedStore ? <AddItemButton storeId={selectedStore.id} /> : null}
		</PageLayout>
	);
}
