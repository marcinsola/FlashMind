import { z } from "zod";

const flashcardProposalSchema = z.object({
  front: z.string().max(200),
  back: z.string().max(500),
});

export const generateFlashcardsSchema = z.object({
  text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters"),
  count: z
    .number()
    .int()
    .min(1, "Must generate at least 1 flashcard")
    .max(200, "Cannot generate more than 200 flashcards at once"),
  existingFlashcards: z.array(flashcardProposalSchema).optional(),
});

export type GenerateFlashcardsSchema = z.infer<typeof generateFlashcardsSchema>;
