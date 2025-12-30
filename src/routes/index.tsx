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
import {
	CalendarDaysIcon,
	CircleEllipsisIcon,
	CogIcon,
	PlusIcon,
	ScrollTextIcon,
	StoreIcon,
} from "lucide-react";
import { useState } from "react";
import z from "zod";
import { DialogDrawer } from "@/components/DialogDrawer";
import { ListItem } from "@/components/ListItem";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
	deleteStoreListItem,
	editStoreListItem,
	getStoreListItemsQueryOptions,
	type StoreListItem,
} from "@/features/items/data";
import { getStoresQueryOptions, type Store } from "@/features/stores/data";
import { authPageMiddleware } from "@/middleware/auth";
import { ActionsMenu } from "@/components/ActionsMenu";

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
				<Button size="icon-lg" variant="outline">
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
			<Button size="icon-lg" className="fixed bottom-4 left-4">
				<PlusIcon />
			</Button>
		</DialogDrawer>
	);
};

function StoreListItemComponent({
	item,
	currentStore,
}: {
	item: StoreListItem;
	currentStore: { id: number } | undefined;
}) {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());

	const queryClient = useQueryClient();
	const { mutate: update } = useMutation({
		mutationFn: editStoreListItem,
		onSuccess(_, variables) {
			const { storeId } = variables.data;
			queryClient.invalidateQueries({
				queryKey: getStoreListItemsQueryOptions({ id: storeId }).queryKey,
			});
			if (currentStore && storeId !== currentStore.id) {
				queryClient.invalidateQueries({
					queryKey: getStoreListItemsQueryOptions({ id: currentStore.id })
						.queryKey,
				});
			}
		},
	});

	const { mutate: deleteItem } = useMutation({
		mutationFn: (id: number) => deleteStoreListItem({ data: { id } }),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: getStoreListItemsQueryOptions({ id: item.storeId }).queryKey,
			});
		},
	});

	const handleRename = () => {
		const newText = prompt("Rename", item.text);
		if (!newText) return;
		update({
			data: {
				...item,
				shoppingNote: item.shoppingNote ?? undefined,
				text: newText,
			},
		});
	};

	const handleCheckChange = (newVal: boolean) => {
		update({
			data: {
				...item,
				shoppingNote: item.shoppingNote ?? undefined,
				checked: newVal,
			},
		});
	};

	const handleDelete = () => {
		deleteItem(item.id);
	};

	const handleStoreUpdate = (storeId: number) => {
		update({
			data: {
				...item,
				shoppingNote: item.shoppingNote ?? undefined,
				storeId,
			},
		});
	};

	return (
		<ListItem
			id={`item-${item.id}`}
			checked={item.checked}
			onCheckedChange={handleCheckChange}
			actions={[
				{
					label: "Rename",
					action: handleRename,
				},
				{
					label: "Delete",
					action: handleDelete,
					variant: "destructive",
				},
				{
					label: "Move to Store",
					subActions: stores
						.filter((s) => s.id !== currentStore?.id)
						.map((store) => ({
							label: store.name,
							action: () => handleStoreUpdate(store.id),
						})),
				},
			]}
		>
			{item.text}
		</ListItem>
	);
}

function App() {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());
	const { s } = Route.useSearch();

	const selectedStore = stores.at(s);

	const { data } = useQuery(getStoreListItemsQueryOptions(selectedStore));

	return (
		<PageLayout
			header={
				<>
					<StoresMenu stores={stores} selected={s} />
					<ActionsMenu />
				</>
			}
			title={selectedStore?.name}
		>
			<div className="space-y-3">
				{data?.map((item) => (
					<StoreListItemComponent
						key={item.id}
						item={item}
						currentStore={selectedStore}
					/>
				))}
			</div>
			{selectedStore ? <AddItemButton storeId={selectedStore.id} /> : null}
		</PageLayout>
	);
}
