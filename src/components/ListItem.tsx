import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

export type ListItemAction =
	| {
			label: string;
			action: () => void;
			variant?: "destructive";
	  }
	| {
			label: string;
			subActions: ListItemAction[];
	  };

type ListItemsProps = {
	id: string | number;
	checked?: boolean;
	onCheckedChange?: (newVal: boolean) => void;
	actions?: ListItemAction[];
	children: React.ReactNode;
};

export function ListItem({
	id,
	checked,
	onCheckedChange,
	children,
	actions,
}: ListItemsProps) {
	const isSelectable =
		typeof checked !== "undefined" && typeof onCheckedChange !== "undefined";

	const content = () => {
		if (isSelectable) {
			return (
				<label htmlFor={id.toString()}>
					<Checkbox
						checked={checked}
						onCheckedChange={onCheckedChange}
						id={id.toString()}
						className="size-5 rounded-full"
					/>
					<div>{children}</div>
				</label>
			);
		}

		return children;
	};

	const display = (
		<Button
			variant="card"
			className="flex items-center h-auto gap-3 p-3"
			asChild={isSelectable}
		>
			{content()}
		</Button>
	);

	if (!actions || actions.length === 0) {
		return display;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{display}</ContextMenuTrigger>
			<ContextMenuContent className="w-52">
				{actions.map((a) => {
					if ("subActions" in a) {
						return (
							<ContextMenuSub>
								<ContextMenuSubTrigger>{a.label}</ContextMenuSubTrigger>
								<ContextMenuSubContent className="w-44">
									{a.subActions.map((action) => {
										// don't support nested sub actions for now
										if ("subActions" in action) {
											return null;
										}
										return (
											<ContextMenuItem
												key={action.label}
												onSelect={action.action}
												variant={action.variant}
											>
												{action.label}
											</ContextMenuItem>
										);
									})}
								</ContextMenuSubContent>
							</ContextMenuSub>
						);
					}

					return (
						<ContextMenuItem
							key={a.label}
							onSelect={a.action}
							variant={a.variant}
						>
							{a.label}
						</ContextMenuItem>
					);
				})}
			</ContextMenuContent>
		</ContextMenu>
	);
}
