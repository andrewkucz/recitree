import type z from "zod";
import { Form } from "@/components/Form";
import { useAppForm } from "@/hooks/use-form";
import { createStoreSchema } from "../schema";

export function StoreForm({
	onSubmit,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: we don't use result
	onSubmit: (data: z.infer<typeof createStoreSchema>) => Promise<any>;
}) {
	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: createStoreSchema,
		},
		onSubmit: ({ value }) => {
			return onSubmit(value);
		},
	});
	return (
		<Form form={form} className="space-y-12">
			<form.AppField name="name">
				{(field) => <field.TextField label="Name" />}
			</form.AppField>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton label="Submit" />
				</form.AppForm>
			</div>
		</Form>
	);
}
