import type { GenerateFlashcardsResponseDto, FlashcardProposalDTO } from "../../types";
import type { OpenRouterResponse } from "../utils/openrouter.utils";
import { OpenRouterError, callOpenRouter } from "../utils/openrouter.utils";

export class GenerationService {
  async generateFlashcards(): Promise<GenerateFlashcardsResponseDto> {
    try {
      // Call mock OpenRouter implementation
      const response = await callOpenRouter();

      // Parse and validate response
      const flashcards = this.parseResponse(response);

      // Return formatted response
      return {
        flashcards: flashcards,
        count: flashcards.length,
      };
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new Error("Failed to generate flashcards", { cause: error });
    }
  }

  private parseResponse(response: OpenRouterResponse): FlashcardProposalDTO[] {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }

      const flashcards = JSON.parse(content) as FlashcardProposalDTO[];

      // Validate the structure of each flashcard
      if (!Array.isArray(flashcards) || !flashcards.every(this.isValidFlashcard)) {
        throw new Error("Invalid flashcard format in response");
      }

      return flashcards;
    } catch (error) {
      throw new Error("Failed to parse OpenRouter response", { cause: error });
    }
  }

  private isValidFlashcard(flashcard: unknown): flashcard is FlashcardProposalDTO {
    return (
      typeof flashcard === "object" &&
      flashcard !== null &&
      "front" in flashcard &&
      "back" in flashcard &&
      typeof flashcard.front === "string" &&
      typeof flashcard.back === "string" &&
      flashcard.front.length <= 200 &&
      flashcard.back.length <= 500
    );
  }
}
