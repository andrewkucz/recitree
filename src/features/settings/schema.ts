import z from "zod";

export const settingsSchema = z.object({
	defaultStore: z.number().int().optional(),
});
