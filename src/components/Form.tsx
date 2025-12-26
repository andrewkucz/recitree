export function Form({
	form,
	children,
	className,
}: {
	form: { handleSubmit: () => void };
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={className}
		>
			{children}
		</form>
	);
}
