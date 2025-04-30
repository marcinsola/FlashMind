# API Endpoint Implementation Plan: Create Collection

## 1. Przegląd punktu końcowego

Punkt końcowy `POST /collections` pozwala zalogowanemu użytkownikowi utworzyć nową kolekcję, zapisując ją w bazie danych Supabase i zwracając pełen obiekt kolekcji.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Ścieżka URL: `/collections`
- Nagłówki:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Parametry:
  - Wymagane:
    - w ciele żądania:
      - `name` (string, min 1, max 255)
  - Opcjonalne: brak
- Przykład body:
  ```json
  {
    "name": "New Collection"
  }
  ```

## 3. Wykorzystywane typy

- DTO zwracane w odpowiedzi:
  ```ts
  export type CollectionDto = Tables<"collections">;
  ```
- Model komendy dla żądania:
  ```ts
  export type CreateCollectionCommand = Pick<TablesInsert<"collections">, "name">;
  ```
- Zod schema w trasie:
  ```ts
  const createCollectionSchema = z.object({
    name: z.string().min(1).max(255),
  });
  ```

## 4. Szczegóły odpowiedzi

- Status: **201 Created**
- Body:
  ```json
  {
    "id": 2,
    "name": "New Collection",
    "user_id": "<uuid>",
    "created_at": "2023-10-01T12:10:00Z",
    "updated_at": "2023-10-01T12:10:00Z"
  }
  ```

## 5. Przepływ danych

1. Klient wysyła żądanie `POST /collections` z tokenem i ciałem JSON.
2. Route handler w `src/pages/api/collections.ts`:
   - Pobiera instancję Supabase z `context.locals.supabase`.
   - Weryfikuje token i wyciąga `user.id`.
   - Parsuje i waliduje body za pomocą Zod.
   - Wywołuje `CollectionService.createCollection(userId, { name })`.
3. `CollectionService`:
   - Wykonuje `await supabase.from("collections").insert({ name, user_id }).select().single()`.
   - Obsługuje błędy DB, ustawia `created_at`/`updated_at`.
4. Route handler zwraca wynik metody serwisu jako JSON z kodem 201.

## 6. Względy bezpieczeństwa

- Uwierzytelnianie: Supabase Auth w kontekście Astro middleware.
- Autoryzacja: sprawdzenie, że operacja dotyczy tylko zalogowanego użytkownika.
- Walidacja: Zod chroni przed niezgodnym typem i nadużyciami.
- Rate limiting: rozważyć w middleware (np. 10 tworzeń/sekundę).
- Injection: zapytania do Supabase ORM i silna walidacja minimalizują ryzyko.

## 7. Obsługa błędów

| Status | Kod zwracany            | Sytuacja                                            |
| ------ | ----------------------- | --------------------------------------------------- |
| 400    | `Bad Request`           | Niepoprawne body / walidacja Zod niepowodzenie      |
| 401    | `Unauthorized`          | Brak lub nieważny token                             |
| 500    | `Internal Server Error` | Błąd w komunikacji z bazą lub nieoczekiwany wyjątek |

## 8. Wydajność

- Indeks na `collections(user_id)` zapewnia szybkie filtrowanie i ewentualne zapytania do listy.
- Asynchroniczne wywołania Supabase i unikanie zbędnych fetchy.
- Cache: rozważyć warstwę cache na listę, ale nie dla tworzenia.

## 9. Kroki implementacji

1. Utworzyć plik trasy: `src/pages/api/collections.ts`.
2. Importować:
   ```ts
   import { z } from "zod";
   import type { APIRoute } from "astro";
   import type { CreateCollectionCommand, CollectionDto } from "../types";
   ```
3. Zdefiniować schema Zod `createCollectionSchema`.
4. Odczytać Supabase z `context.locals.supabase`, autoryzować użytkownika.
5. Parsować i walidować body:
   ```ts
   const parse = createCollectionSchema.safeParse(await request.json());
   if (!parse.success) return new Response("Bad Request", { status: 400 });
   ```
6. Utworzyć serwis `src/lib/services/collection.ts` z metodą:
   ```ts
   export async function createCollection(
     supabase: SupabaseClient,
     userId: string,
     cmd: CreateCollectionCommand
   ): Promise<CollectionDto> {
     /* ... */
   }
   ```
7. W trasie wywołać serwis i zwrócić:
   ```ts
   const newCol = await createCollection(supabase, user.id, { name });
   return new Response(JSON.stringify(newCol), { status: 201 });
   ```
8. Dodać obsługę wyjątków i logowanie błędów.
9. Zaktualizować typy w `src/types.ts`.
