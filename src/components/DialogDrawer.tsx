"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function DialogDrawer({
	title,
	description,
	content,
	children,
	open: propsOpen,
	onOpenChange: propsOnOpenChange,
	fullHeight,
}: {
	title: string;
	description?: string;
	content: React.ReactNode;
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	fullHeight?: boolean;
}) {
	const [internalOpen, setInternalOpen] = React.useState(propsOpen ?? false);
	const open = typeof propsOpen !== "undefined" ? propsOpen : internalOpen;
	const onOpenChange =
		typeof propsOnOpenChange !== "undefined"
			? propsOnOpenChange
			: setInternalOpen;
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const drawerContentAutoFocusRef = React.useCallback(
		(ref: HTMLDivElement | null) => {
			if (!ref || !open) return;
			setTimeout(() => {
				ref.querySelector("input")?.focus();
			}, 0);
		},
		[open],
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				{children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
				<DialogContent className="sm:max-w-105">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description ? (
							<DialogDescription>{description}</DialogDescription>
						) : null}
					</DialogHeader>
					{content}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			{children ? <DrawerTrigger asChild>{children}</DrawerTrigger> : null}
			<DrawerContent
				ref={drawerContentAutoFocusRef}
				className={cn(
					"px-6 max-h-full overflow-auto [&_button[type=submit]]:w-full",
					{
						"min-h-screen": fullHeight,
					},
				)}
			>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					{description ? (
						<DrawerDescription>{description}</DrawerDescription>
					) : null}
				</DrawerHeader>
				{content}
				<DrawerFooter className="pb-12 px-0">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
