import { cn } from "@/lib/utils";

export function PageLayout({
	children,
	header,
	title,
}: {
	children: React.ReactNode;
	header?: React.ReactNode;
	title?: string;
}) {
	return (
		<>
			{header && (
				<header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6">
					{header}
				</header>
			)}
			<main className={cn("p-6", { "pt-16": !!header })}>
				{title ? <h1 className="text-xl font-bold mb-2">{title}</h1> : null}
				{children}
			</main>
		</>
	);
}
