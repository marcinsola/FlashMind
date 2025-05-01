import { useState } from "react";
import type { FlashcardProposalDTO, GenerateFlashcardsCommand, GenerateFlashcardsResponseDto } from "@/types";

interface UseGenerateFlashcardsOptions {
  onSuccess?: (data: FlashcardProposalDTO[]) => void;
  onError?: (error: Error) => void;
}

export function useGenerateFlashcards(options: UseGenerateFlashcardsOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = async (command: GenerateFlashcardsCommand) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data: GenerateFlashcardsResponseDto = await response.json();
      options.onSuccess?.(data.flashcards);
      return data.flashcards;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generate,
    isLoading,
    error,
  };
}
