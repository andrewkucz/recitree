import type z from "zod";
import { Form } from "@/components/Form";
import { useAppForm } from "@/hooks/use-form";
import { createStoreListItemSchema } from "../schema";

export function StoreListItemForm({
	onSubmit,
	storeId,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: we don't use result
	onSubmit: (data: z.infer<typeof createStoreListItemSchema>) => Promise<any>;
	storeId: number;
}) {
	const defaultValues: z.infer<typeof createStoreListItemSchema> = {
		text: "",
		storeId,
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: createStoreListItemSchema,
		},
		onSubmit: ({ value }) => {
			return onSubmit({ ...value, storeId });
		},
	});

	return (
		<Form form={form} className="space-y-12">
			<form.AppField name="text">
				{(field) => <field.TextField label="Text" />}
			</form.AppField>
			<form.AppField name="shoppingNote">
				{(field) => <field.TextField label="Shopping Note" />}
			</form.AppField>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton label="Submit" />
				</form.AppForm>
			</div>
		</Form>
	);
}
