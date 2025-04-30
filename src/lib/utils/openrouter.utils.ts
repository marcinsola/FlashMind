import { type FlashcardProposalDTO } from "../../types";

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export async function callOpenRouter(): Promise<OpenRouterResponse> {
  // Mock response with 3 sample flashcards
  const mockFlashcards: FlashcardProposalDTO[] = [
    {
      front: "What is the capital of France?",
      back: "Paris is the capital and largest city of France.",
    },
    {
      front: "Who wrote 'Romeo and Juliet'?",
      back: "William Shakespeare wrote 'Romeo and Juliet' between 1591 and 1595.",
    },
    {
      front: "What is photosynthesis?",
      back: "Photosynthesis is the process by which plants convert light energy into chemical energy to produce glucose from carbon dioxide and water.",
    },
  ];

  return {
    choices: [
      {
        message: {
          content: JSON.stringify(mockFlashcards),
        },
      },
    ],
  };
}

export function buildGenerationPrompt(
  text: string,
  count: number,
  existingFlashcards?: FlashcardProposalDTO[]
): string {
  let prompt = `Generate ${count} educational flashcards from the following text. 
Each flashcard should have a front (question) and back (answer).
The front should be a clear, concise question (max 200 characters).
The back should contain a complete, accurate answer (max 500 characters).
Format the output as a JSON array of objects with 'front' and 'back' properties.

Text to process:
${text}`;

  if (existingFlashcards?.length) {
    prompt += `\n\nAvoid generating duplicates of these existing flashcards:
${JSON.stringify(existingFlashcards, null, 2)}`;
  }

  return prompt;
}
