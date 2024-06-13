import { string, z } from "zod";
export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "A title is required" }).max(100),

  content: z
    .string()
    .min(0)
    .max(1000, { message: "Your notes can not exceed 1000 letters" })
    .optional(),
});

export type createNoteType = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export type updateNoteType = z.infer<typeof updateNoteSchema>;

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});

export type deleteNoteType = z.infer<typeof deleteNoteSchema>;
