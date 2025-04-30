import type { Tables, TablesInsert, TablesUpdate } from "./db/database.types";

/**
 * DTOs and Command Models for FlashMind API
 */

// ------------------------
// Collection
// ------------------------

/**
 * Collection entity as returned by API (mirrors DB Row type).
 */
export type CollectionDto = Tables<"collections">;

/**
 * Command model for creating a collection.
 */
export type CreateCollectionCommand = Pick<TablesInsert<"collections">, "name">;

/**
 * Response types for collection endpoints
 */
export interface CreateCollectionResponseDto {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiErrorResponse {
  errors: {
    code?: string;
    message: string;
    path?: string[];
  }[];
}

/**
 * Command model for updating a collection.
 */
export type UpdateCollectionCommand = Required<Pick<TablesUpdate<"collections">, "name">>;

// ------------------------
// Flashcard
// ------------------------

/**
 * Flashcard entity as returned by API (mirrors DB Row type).
 */
export type FlashcardDto = Tables<"flashcards">;

/**
 * Command model for manually creating a flashcard.
 * Includes 'collection_id' to link to the parent collection.
 */
export type CreateFlashcardCommand = Omit<TablesInsert<"flashcards">, "id" | "created_at" | "updated_at">;

/**
 * Command model for updating a flashcard.
 */
export type UpdateFlashcardCommand = Required<Pick<TablesUpdate<"flashcards">, "front" | "back">>;
/**
 * Flashcard proposal returned from LLM, not yet persisted in database.
 * Used to check for duplicates during flashcard generation.
 */
export type FlashcardProposalDTO = Pick<FlashcardDto, "front" | "back">;

/**
 * Command model for generating flashcards via AI.
 */
export interface GenerateFlashcardsCommand {
  text: string;
  count: number;
  existingFlashcards?: FlashcardProposalDTO[];
}

/**
 * Response payload for generate flashcards command.
 */
export interface GenerateFlashcardsResponseDto {
  flashcards: FlashcardProposalDTO[];
  count: number;
}

// ------------------------
// Bulk Operations
// ------------------------

/**
 * Command model for bulk-creating flashcards within a collection.
 */
export interface BulkCreateFlashcardsCommand {
  collectionId: string;
  flashcards: FlashcardProposalDTO[];
}

// ------------------------
// Logs
// ------------------------

/**
 * Log entry as returned by API (mirrors DB Row type).
 */
export type LogDto = Tables<"logs">;

/**
 * Command model for creating a log entry after collection finalization.
 */
export type CreateLogCommand = Omit<TablesInsert<"logs">, "id" | "created_at" | "user_id">;

// ------------------------
// Authentication
// ------------------------

/**
 * Authenticated user payload returned from auth endpoints.
 */
export interface AuthUserDto {
  id: string;
  email: string;
}

/**
 * Response payload for login/register endpoints.
 */
export interface AuthResponseDto {
  token: string;
  user: AuthUserDto;
}

/**
 * Command model for user registration.
 */
export interface RegisterUserCommand {
  email: string;
  password: string;
}

/**
 * Command model for user login.
 */
export interface LoginUserCommand {
  email: string;
  password: string;
}

/**
 * Response payload for logout endpoint.
 */
export interface LogoutResponseDto {
  message: string;
}
