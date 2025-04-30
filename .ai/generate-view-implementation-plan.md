# Plan implementacji widoku Generowanie fiszek

## 1. Przegląd

Widok `Generowanie fiszek` pozwala użytkownikowi wprowadzić dowolny tekst (1 000–10 000 znaków) oraz liczbę fiszek (1–200), aby za pomocą AI wygenerować propozycje fiszek w formacie pytanie/odpowiedź. Użytkownik może akceptować, odrzucać, edytować lub regenerować brakujące fiszki, a następnie zapisać całą kolekcję.

## 2. Routing widoku

**Ścieżka:** `/generate`

## 3. Struktura komponentów

```
GeneratePage (Astro + React)
└── GenerateView (React)
    ├── GenerateForm
    ├── ActionButtons (Regenerate, Zaakceptuj wszystkie, Zapisz)
    ├── FlashcardGrid
    │   ├── FlashcardProposalCard (dla każdej fiszki)
    │   └── FlashcardInlineEditor (inline)
    └── LoadingSpinner + ConfirmationModal
```

## 4. Szczegóły komponentów

### GenerateForm

- Opis: Formularz z `Textarea` na tekst źródłowy i `InputNumber` na liczbę fiszek.
- Elementy:
  - `<textarea>` z inline walidacją długości (min 1 000, max 10 000)
  - `<input type="number">` (1–200)
  - Przycisk `Generuj`
- Zdarzenia:
  - `onSubmit` wywołuje generation hook
  - `onChange` waliduje długość
- Walidacja:
  - tekst: długość 1 000–10 000 znaków
  - count: 1–200
- Typy:
  - GenerateFormData { text: string; count: number }
- Propsy:
  - `onGenerate(data: GenerateFormData): void`

### ActionButtons

- Opis: Zestaw przycisków: „Regenerate missing”, „Zaakceptuj wszystkie”, „Zapisz kolekcję”.
- Elementy:
  - `<Button>` z `onClick`
- Zdarzenia:
  - `onRegenerateMissing()`, `onAcceptAll()`, `onSaveCollection()`
- Propsy:
  - booleany `disable` wg stanu

### FlashcardGrid

- Opis: Wyświetla grid responsywny (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- Elementy:
  - lista `FlashcardProposalCard` lub `FlashcardInlineEditor` gdy w edycji
- Propsy:
  - `cards: FlashcardViewModel[]`, `onEdit(id)`, `onAccept(id)`, `onReject(id)`

### FlashcardProposalCard

- Opis: Pojedyncza fiszka z front/back i przyciskami „Edytuj”, „Akceptuj”, „Odrzuć”.
- Zdarzenia:
  - `onEdit()`, `onAccept()`, `onReject()`
- Typy props:
  - { card: FlashcardViewModel }

### FlashcardInlineEditor

- Opis: Edytor zastępujący card, dwa pola tekstowe i przycisk `Zapisz`.
- Zdarzenia: `onSave(updated: { front, back })`
- Walidacja:
  - front ≤ 200 zn., back ≤ 500 zn.

### LoadingSpinner

- Użycie wewnątrz przycisków i podczas żądań.

### ConfirmationModal

- Ostrzega przed utratą niesaved danych.
- Propsy: `isOpen`, `onConfirm`, `onCancel`

## 5. Typy

### DTO i ViewModel

```ts
// Komenda generowania
interface GenerateFlashcardsCommand {
  text: string;
  count: number;
  existingFlashcards?: FlashcardProposalDTO[];
}
// Propozycja z API
interface FlashcardProposalDTO {
  front: string;
  back: string;
}
// Widokowa reprezentacja fiszki
interface FlashcardViewModel extends FlashcardProposalDTO {
  id: string;
  status: "pending" | "accepted" | "editing";
}
// Dane formularza
interface GenerateFormData {
  text: string;
  count: number;
}
```

## 6. Zarządzanie stanem

- `useGenerateFlashcards` (custom hook oparty o React Query):
  - wywołuje POST `/api/flashcards/generate`
  - zarządza `isLoading`, `data`, `error`
- `flashcards` (tablica FlashcardViewModel)
- `unsavedChanges: boolean` (przy edycji lub przyjmowaniu/odrzucaniu)
- `showConfirmModal: boolean`

## 7. Integracja API

- `POST /api/flashcards/generate`
  - RequestBody: `GenerateFlashcardsCommand`
  - Response: `GenerateFlashcardsResponseDto` ({ flashcards, count })
- `POST /api/collections` (CreateCollectionCommand) – utworzenie kolekcji
- `POST /api/collections/{collectionId}/flashcards` (BulkCreateFlashcardsCommand) – przypisanie fiszek do kolekcji

## 8. Interakcje użytkownika

1. Wpisanie tekstu i liczby → przycisk Generuj → spinner → grid fiszek
2. Klik `Edytuj` → inline editor → `Zapisz` → aktualizacja modelu, `unsavedChanges = true`
3. Klik `Akceptuj wszystkie` → wszystkie statusy = accepted
4. Klik `Regenerate missing` → wywołanie API z existingFlashcards tylko dla rejected/missing
5. Klik `Zapisz kolekcję` → potwierdzenie → bulk POST → toast sukcesu lub error → redirect/ostatnia strona
6. Nawigacja poza `/generate` z `unsavedChanges` = popup modalu potwierdzenia

## 9. Warunki i walidacja

- `text.length >= 1000 && <= 10000`
- `count >=1 && <=200`
- Dla edytora: `front.length <=200`, `back.length <=500`
- Przy Regenerate: bierze count z głównego formularza, existingFlashcards o statusie `accepted`

## 10. Obsługa błędów

- Błędy walidacji formularza: komunikaty inline
- Błędy API: toast z `useToast()` i możliwość retry
- Timeout/404/500: toast + opcja powtórzenia

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/generate/index.astro`, podłączyć `GenerateView` client:load
2. Założyć folder `src/components/generate` i utworzyć szkielety komponentów według sekcji 4
3. Zdefiniować nowe typy w `src/types.ts` (FlashcardViewModel, GenerateFormData)
4. Napisać hook `useGenerateFlashcards` w `src/lib/hooks` (React Query)
5. W `GenerateForm` zaimplementować formularz z walidacją (React Hook Form lub własna)
6. Zaimplementować `FlashcardGrid` i karty/edytor inline
7. Dodać `ActionButtons` i logikę dla wszystkich przycisków
8. Dodać blokady przy `isLoading` i spinnery
9. Zaimplementować `ConfirmationModal` i hook blokujący nawigację (`beforeunload`)
10. Dodać obsługę toasts (`useToast()`) przy zdarzeniach sukces/błąd
11. Przetestować ścieżki: generowanie, edycja, odrzucanie, regeneracja, zapis i nawigację poza
12. Wyrównać style z Tailwind 4 i Shadcn/ui, dodać ARIA roles

---

_Ten plan zapewnia kompletną ścieżkę od analizy wymagań do kroków implementacyjnych dla widoku Generowanie fiszek._
