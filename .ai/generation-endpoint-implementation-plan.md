# API Endpoint Implementation Plan: Generate Flashcards

## 1. Endpoint Overview

REST API endpoint that leverages AI to generate educational flashcards from provided text input. The endpoint processes text content, generates a specified number of flashcards, and returns them as proposals for user review. It includes duplicate detection when existing flashcards are provided.

## 2. Request Details

- **Method:** POST
- **URL Pattern:** `/api/flashcards/generate`
- **Parameters:**
  - Required:
    - `text`: Source text for flashcard generation (1000-10000 characters)
    - `count`: Number of flashcards to generate (1-200)
  - Optional:
    - `existingFlashcards`: Array of previously generated and accepted flashcards for duplicate detection
- **Request Body Schema:**
  ```typescript
  {
    text: string,
    count: number,
    existingFlashcards?: Array<{
      front: string,
      back: string
    }>
  }
  ```

## 3. Types and Models

### Command Models

```typescript
// src/types.ts
export interface GenerateFlashcardsCommand {
  text: string;
  count: number;
  existingFlashcards?: FlashcardProposalDTO[];
}

export type FlashcardProposalDTO = {
  front: string;
  back: string;
};

export interface GenerateFlashcardsResponseDto {
  flashcards: FlashcardProposalDTO[];
  count: number;
}
```

## 4. Response Details

- **Success Response (200 OK):**
  ```json
  {
    "flashcardProposals": [
      {
        "front": "Question text (≤200 chars)",
        "back": "Answer text (≤500 chars)"
      }
    ],
    "count": 10
  }
  ```
- **Error Responses:**
  - 400 Bad Request: Invalid input parameters
  - 401 Unauthorized: Missing/invalid authentication
  - 429 Too Many Requests: Rate limit exceeded
  - 500 Internal Server Error: AI service or server failure

## 5. Data Flow

1. Request Validation
   - Validate authentication token
   - Validate input parameters
2. Service Processing
   - Process text through OpenRouter.ai
   - Return generated flashcards
3. Response Formation
   - Format flashcards according to DTO
   - Return response

## 6. Security Considerations

1. Authentication
   - Require valid Supabase session token
   - Validate user permissions
2. Input Validation
   - Sanitize text input
   - Validate count range
   - Validate flashcard structure
3. Rate Limiting
   - Implement per-user rate limits
   - Track API usage
4. Error Handling
   - Sanitize error messages
   - Log security events

## 7. Error Handling

1. Input Validation Errors (400)
   - Invalid count range
   - Missing/empty text
   - Malformed existingFlashcards
2. Authentication Errors (401)
   - Missing token
   - Invalid token
   - Expired token
3. Rate Limit Errors (429)
   - Too many requests
4. Server Errors (500)
   - AI service failure
   - Internal processing errors
   - Unexpected exceptions

## 8. Performance Considerations

1. Caching
   - Cache AI service responses
   - Implement request deduplication
2. Rate Limiting
   - Implement sliding window rate limiting
   - Track usage metrics
3. Resource Management
   - Limit concurrent AI requests
   - Implement request timeouts
4. Monitoring
   - Track response times
   - Monitor error rates
   - Log performance metrics

## 9. Implementation Steps

### 1. Setup Project Structure

```typescript
src/
  ├── pages/
  │   └── api/
  │       └── flashcards/
  │           └── generate.ts
  ├── lib/
  │   ├── services/
  │   │   └── generation.service.ts     # Handles OpenRouter.ai interaction
  │   ├── validators/
  │   │   └── generation.validator.ts   # Validates generation requests
  │   └── utils/
  │       └── openrouter.utils.ts       # OpenRouter.ai helper functions
```

### 2. Create Validation Layer

1. Implement Zod schema for request validation
2. Create input sanitization utilities
3. Add validation middleware

### 3. Implement Service Layer

#### 3.1 Create GenerationService

```typescript
// src/lib/services/generation.service.ts
export class GenerationService {
  constructor(private readonly openRouterConfig: OpenRouterConfig) {}

  // Generation
  async generateFlashcards(command: GenerateFlashcardsCommand): Promise<GenerateFlashcardsResponseDto> {
    try {
      // 1. Prepare prompt with:
      //    - Input text
      //    - Desired count
      //    - Format requirements (char limits)
      //    - Existing flashcards to avoid duplicates

      // 2. Call OpenRouter.ai
      const response = await this.callOpenRouter(prompt);

      // 3. Parse and validate response
      const flashcards = this.parseResponse(response);

      // 4. Return formatted response
      return {
        flashcards,
        count: flashcards.length,
      };
    } catch (error) {
      // Handle errors appropriately
      throw this.handleError(error);
    }
  }

  private async callOpenRouter(prompt: string): Promise<OpenRouterResponse> {
    // Implementation
  }

  private parseResponse(response: OpenRouterResponse): FlashcardProposalDTO[] {
    // Implementation
  }

  private handleError(error: unknown): Error {
    // Implementation
  }
}
```

### 4. Create API Endpoint

1. Implement POST handler using GenerationService
2. Add authentication middleware
3. Integrate validation layer
4. Implement error handling
5. Add rate limiting
