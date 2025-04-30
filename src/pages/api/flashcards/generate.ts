import type { APIRoute } from "astro";
import { generateFlashcardsSchema } from "../../../lib/validators/generation.validator";
import { GenerationService } from "../../../lib/services/generation.service";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body against schema
    const result = generateFlashcardsSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate flashcards
    const generationService = new GenerationService();
    const response = await generationService.generateFlashcards();

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to generate flashcards",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
