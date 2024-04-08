import {z} from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(1, "Note must have a title."),
    content: z.string().optional()
})

// Create a TypeScript type 'CreateNoteSchema' based on the defined schema
// This inferred type will have the shape ->
// { title: string, content?: string }
export type CreateNoteSchema = z.infer<typeof createNoteSchema>;