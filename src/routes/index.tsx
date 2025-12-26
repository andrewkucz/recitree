import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	stripSearchParams,
} from "@tanstack/react-router";
import { StoreIcon } from "lucide-react";
import z from "zod";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function App() {
	const { data: stores } = useSuspenseQuery(getStoresQueryOptions());
	const { s } = Route.useSearch();

	const selectedStore = stores[s];

	return (
		<PageLayout
			header={<StoresMenu stores={stores} selected={s} />}
			title={selectedStore?.name}
		>
			<div>Stuff here</div>
		</PageLayout>
	);
}
