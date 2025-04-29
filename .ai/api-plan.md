# REST API Plan

## 1. Resources

- **Collections**:

  - Represents a user's flashcard collection.
  - Maps directly to the `collections` table in the database.
  - Key fields: `id`, `name`, `user_id`, `created_at`, `updated_at`, `deleted_at` (for soft deletion).

- **Flashcards**:

  - Represents individual flashcards belonging to a collection.
  - Maps to the `flashcards` table.
  - Key fields: `id`, `collection_id`, `front` (max 200 characters), `back` (max 500 characters), `created_at`, `updated_at`.

- **Logs**:

  - Captures metadata about flashcard generation events.
  - Maps to the `logs` table.
  - Key fields: `id`, `user_id`, `collection_id`, `total_generated`, `total_accepted`, `created_at`.

- **Authentication (Users)**:
  - Although not explicitly stored in the schema, user registration and login are handled via Supabase Auth and integrated into the API endpoints.

## 2. Endpoints

For each resource, endpoints adhere to RESTful conventions and are grouped logically. All endpoints except authentication require JWT-based authorization. Pagination, filtering, and sorting are supported where applicable.

### 2.1 Collections Endpoints

- **List Collections**

  - **Method:** GET
  - **URL:** `/collections`
  - **Description:** Retrieves all collections for the authenticated user. Supports pagination and filtering (e.g., active collections only).
  - **Query Parameters:** `page`, `per_page`, `sort` (optional)
  - **Response Payload:**
    ```json
    [
      {
        "id": 1,
        "name": "Biology 101",
        "user_id": "<uuid>",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z"
      }
    ]
    ```

- **Create Collection**

  - **Method:** POST
  - **URL:** `/collections`
  - **Description:** Creates a new collection.
  - **Request Payload:**
    ```json
    { "name": "New Collection" }
    ```
  - **Response Payload:**
    ```json
    {
      "id": 2,
      "name": "New Collection",
      "user_id": "<uuid>",
      "created_at": "2023-10-01T12:10:00Z",
      "updated_at": "2023-10-01T12:10:00Z"
    }
    ```

- **Get Collection Details**

  - **Method:** GET
  - **URL:** `/collections/{id}`
  - **Description:** Retrieves details of a specific collection.
  - **Response Payload:** Same as create response.

- **Update Collection**

  - **Method:** PUT
  - **URL:** `/collections/{id}`
  - **Description:** Updates the name or other editable fields of a collection.
  - **Request Payload:**
    ```json
    { "name": "Updated Collection Name" }
    ```
  - **Response Payload:** Updated collection object.

- **Delete (Soft-Delete) Collection**
  - **Method:** DELETE
  - **URL:** `/collections/{id}`
  - **Description:** Soft-deletes the collection by setting `deleted_at`.
  - **Response:** Success message or status code.

### 2.2 Flashcards Endpoints

- **List Flashcards for a Collection**

  - **Method:** GET
  - **URL:** `/collections/{collectionId}/flashcards`
  - **Description:** Retrieves all flashcards that belong to a specific collection. Supports pagination.
  - **Query Parameters:** `page`, `per_page`
  - **Response Payload:**
    ```json
    [
      {
        "id": 10,
        "collection_id": 2,
        "front": "What is the powerhouse of the cell?",
        "back": "Mitochondria",
        "created_at": "2023-10-01T12:15:00Z",
        "updated_at": "2023-10-01T12:15:00Z"
      }
    ]
    ```

- **Create (Manual) Flashcards**

  - **Method:** POST
  - **URL:** `/collections/{collectionId}/flashcards`
  - **Description:** Manually creates one or more flashcards within a collection.
  - **Request Payload:**
    ```json
    [
      { "front": "Question text 1", "back": "Answer text 1" },
      { "front": "Question text 2", "back": "Answer text 2" }
    ]
    ```
  - **Response Payload:** Array of newly created flashcard objects.

- **Get Flashcard Details**

  - **Method:** GET
  - **URL:** `/flashcards/{id}`
  - **Description:** Retrieves detailed information about a specific flashcard.

- **Update Flashcard**

  - **Method:** PUT
  - **URL:** `/flashcards/{id}`
  - **Description:** Edits a flashcard's front or back text (supports manual edits and accept/reject flows).
  - **Request Payload:**
    ```json
    { "front": "Updated question", "back": "Updated answer" }
    ```
  - **Response Payload:** Updated flashcard object.

- **Generate Flashcards via AI**
  - **Method:** POST
  - **URL:** `/flashcards/generate`
  - **Description:** Generates flashcards using AI from the provided text input and desired count (1–200). Optionally, previously generated flashcards can be provided via the `existingFlashcards` field to regenerate missing or rejected flashcards. The flashcards are not yet associated with any collection.
  - **Request Payload:**
    ```json
    {
      "text": "Source text for flashcards",
      "count": 10,
      "existingFlashcards": [{ "id": 5, "front": "Question text", "back": "Answer text" }]
    }
    ```
    Note: The `existingFlashcards` field is optional. If provided, it includes flashcards already generated to help the model avoid creating duplicate flashcards. The `count` field is final and represents the total number of flashcards to generate, as determined by the frontend.
  - **Response Payload:** Array of generated flashcard objects, each adhering to length constraints (front ≤200 chars, back ≤500 chars).

### 2.3 Logs Endpoints

- **List Logs**

  - **Method:** GET
  - **URL:** `/logs`
  - **Description:** Retrieves flashcard generation logs for the authenticated user. Supports pagination.
  - **Query Parameters:** `page`, `per_page`
  - **Response Payload:**
    ```json
    [
      {
        "id": 5,
        "user_id": "<uuid>",
        "collection_id": 2,
        "total_generated": 10,
        "total_accepted": 8,
        "created_at": "2023-10-01T12:20:00Z"
      }
    ]
    ```

- **Create Log Entry**
  - **Method:** POST
  - **URL:** `/logs`
  - **Description:** Records a new log entry when a collection is finalized.
  - **Request Payload:**
    ```json
    { "collectionId": 2, "total_generated": 10, "total_accepted": 8 }
    ```
  - **Response Payload:** Created log object.

### 2.4 Authentication Endpoints

- **Register User**

  - **Method:** POST
  - **URL:** `/auth/register`
  - **Description:** Registers a new user using email and password.
  - **Request Payload:**
    ```json
    { "email": "user@example.com", "password": "securePassword" }
    ```
  - **Response Payload:** User details and/or authentication token.

- **Login User**

  - **Method:** POST
  - **URL:** `/auth/login`
  - **Description:** Authenticates a user and returns a JWT token.
  - **Request Payload:**
    ```json
    { "email": "user@example.com", "password": "securePassword" }
    ```
  - **Response Payload:**
    ```json
    { "token": "<JWT token>", "user": { "id": "<uuid>", "email": "user@example.com" } }
    ```

- **Logout User**
  - **Method:** POST
  - **URL:** `/auth/logout`
  - **Description:** Logs the user out, invalidating the current session/token.
  - **Response:** Success message.

## 3. Authentication and Authorization

- **Mechanism:** JWT-based authentication.
  - All protected endpoints require the `Authorization: Bearer <token>` header.
  - The API leverages Supabase's authentication and row-level security (RLS) to ensure that users only access their own data.
  - Endpoints under `/auth/*` are publicly accessible for registration and login.

## 4. Validation and Business Logic

- **Database Validation Rules:**

  - **Flashcards:**
    - `front` text must not exceed 200 characters.
    - `back` text must not exceed 500 characters.
  - **Collections:**
    - Must have a non-empty `name`.

- **Business Logic:**

  - **AI Flashcard Generation:**
    - Validates that the source text is provided and the `count` is within 1000–10000.
    - Ensures generated flashcards conform to field length constraints; auto-truncation or error messages are provided if not.
  - **Manual Edit & Review Workflow:**
    - Users can accept, reject, or edit flashcards. Only accepted flashcards are finalized when the collection is saved.
    - A specialized regeneration endpoint handles only missing or rejected flashcards.
  - **Finalization:**
    - A finalization process (which could be implemented via an endpoint or client logic) ensures that flashcards are only persisted once approved and logs are recorded accordingly.

- **Error Handling:**
  - Returns 400 for validation errors.
  - 401/403 for unauthorized access.
  - 404 for resources not found.
  - Error responses include detailed messages and error codes for debugging.

## 5. Security and Performance Considerations

- **Security:**
  - JWT authentication and Supabase RLS enforce data ownership and privacy.
  - Rate limiting is implemented to prevent abuse of endpoints.
  - All user inputs are validated and sanitized.
- **Performance:**
  - List endpoints support pagination, sorting, and filtering to reduce data load.
  - Indexes on `user_id` and `collection_id` in the database aid in query efficiency.
- **Logging:**
  - All errors and significant operations (e.g., flashcard generation and finalization) are logged for monitoring and debugging.
