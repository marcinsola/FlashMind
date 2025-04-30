# Architektura UI dla FlashMind

## 1. Przegląd struktury UI

FlashMind będzie podzielony na trzy główne obszary:

- **Autoryzacja:** strony logowania i rejestracji z walidacją formularzy.
- **Generowanie fiszek:** interaktywny formularz do wprowadzania tekstu źródłowego, liczby fiszek oraz przegląd/edycja propozycji.
- **Zarządzanie kolekcjami:** lista kolekcji z paginacją i "Load more" oraz szczegóły kolekcji w formie responsywnej siatki z inline edycją.

Całość oparta na Astro 5, React 19, TypeScript 5, Shadcn/ui, Tailwind 4.

## 2. Lista widoków

### 2.1. Logowanie

- Ścieżka: `/login`
- Cel: Uwierzytelnienie istniejącego użytkownika.
- Kluczowe informacje: pola `email`, `password`, przycisk `Zaloguj`, link do rejestracji.
- Kluczowe komponenty: `AuthForm`, `Input`, `Button`, `useToast()`.
- UX/dostępność/bezpieczeństwo:
  - Walidacja inline (Zod + react-hook-form).
  - HttpOnly cookie, CSRF token, obsługa 401.
  - Atrybuty ARIA, focus na pierwszym polu.

### 2.2. Rejestracja

- Ścieżka: `/register`
- Cel: Utworzenie nowego konta.
- Kluczowe informacje: pola `email`, `password`, `confirm password`, przycisk `Zarejestruj`.
- Kluczowe komponenty: jak w logowaniu + sprawdzanie zgodności haseł.
- UX/dostępność/bezpieczeństwo:
  - Inline validator, komunikaty błędów.
  - Zarządzanie loaderem i blokada formularza.

### 2.3. Generowanie fiszek

- Ścieżka: `/generate`
- Cel: Automatyczne tworzenie propozycji fiszek z tekstu.
- Kluczowe informacje:
  - `Textarea` (max 10000 znaków) + inline walidacja.
  - `Input number` (1–200).
  - Przyciski `Generuj`, `Regenerate missing`, `Zaakceptuj wszystkie`, `Zapisz kolekcję`.
  - Siatka `FlashcardGrid` responsywna (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
  - Przycisk `Edytuj` dla każdej fiszki, po kliknięciu pojawia się `FlashcardInlineEditor` z przyciskiem `Zapisz`.
- Kluczowe komponenty: `GenerateForm`, `FlashcardGrid`, `FlashcardProposalCard`, `FlashcardInlineEditor`, `LoadingSpinner`, `ConfirmationModal`, `useToast()`.
- UX/dostępność/bezpieczeństwo:
  - Blokada i spinner podczas generowania/zapisu.
  - ARIA roles dla edytorów i modali.
  - Ostrzeżenie przed opuszczeniem strony bez zapisu.

### 2.4. Lista kolekcji

- Ścieżka: `/collections`
- Cel: Przeglądanie wszystkich kolekcji użytkownika.
- Kluczowe informacje:
  - Siatka/lista kolekcji (50 elementów + `Load more`).
  - Nazwa kolekcji, data utworzenia, przycisk `Usuń`/`Edytuj nazwę`.
- Kluczowe komponenty: `CollectionsList`, `CollectionCard`, `LoadMoreButton`, `ConfirmationModal`.
- UX/dostępność/bezpieczeństwo:
  - Paginacja leniwa, wsparcie dla klawiatury.
  - Soft-delete z potwierdzeniem.

### 2.5. Szczegóły kolekcji

- Ścieżka: `/collections/:id`
- Cel: Przegląd i edycja fiszek w konkretnej kolekcji.
- Kluczowe informacje:
  - Siatka fiszek (grid 3-kolumnowy responsywny).
  - Inline edycja i usuwanie każdej fiszki.
  - Licznik zaakceptowanych fiszek i przycisk `Zapisz zmiany`.
- Kluczowe komponenty: `FlashcardGrid`, `FlashcardItem`, `FlashcardInlineEditor`, `DeleteButton`, `LoadingSpinner`, `useToast()`, `ConfirmationModal`.
- UX/dostępność/bezpieczeństwo:
  - Guard clauses do walidacji długości pól.
  - Blokada i spinner przy zapisywaniu.

## 3. Mapa podróży użytkownika

1. Użytkownik odwiedza `/login` lub `/register`.
2. Po udanym uwierzytelnieniu przekierowanie do `/generate`.
3. W widoku `/generate` wprowadza tekst i liczbę fiszek, klika `Generuj`.
4. System wyświetla siatkę propozycji z inline edycją.
5. Użytkownik może `Zaakceptuj wszystkie` lub zaakceptować pojedyncze fiszki przyciskiem `Akceptuj`, a także edytować je pojedynczo.
6. Kliknięcie `Zapisz kolekcję` uruchamia modal potwierdzenia.
7. Po potwierdzeniu następuje wywołanie API, redirect do `/collections/:id`.
8. W widoku szczegółów kolekcji użytkownik może dalej edytować/usuwać i zapisać zmiany.
9. W topbar wybiera `Kolekcje` i przegląda listę, ładuje więcej.
10. Logout czyści stan i redirect do `/login`.

## 4. Układ i struktura nawigacji

- **Topbar (po zalogowaniu):**
  - Logo/Brand (klik → `/generate`).
  - Linki: `Generuj`, `Kolekcje`, `Logout`.
  - Responsive menu (hamburger na mobilkach).
- **Footer:** minimalny, link do pomocy/Polityki prywatności.
- **ProtectedRoute** wrapper zabezpiecza widoki przed nieautoryzowanym dostępem.

## 5. Kluczowe komponenty

- **AuthForm** – wspólny formularz logowania/rejestracji z `react-hook-form` + Zod.
- **GenerateForm** – textarea + licznik znaków + walidacja.
- **FlashcardGrid** – responsywna siatka z Tailwind.
- **FlashcardInlineEditor** – edycja front/back, walidacja i przycisk `Zapisz`.
- **CollectionsList** + **CollectionCard** – wyświetlanie kolekcji z lazy-load.
- **ConfirmationModal** – potwierdzenie opuszczenia/operacji.
- **LoadingSpinner** – spinner blokujący formularze.
- **useToast** – do komunikatów sukcesu i błędów.
- **AxiosClient** – globalny interceptor (credentials: 'include', CSRF, 401 → logout).
- **UIContext / useReducer** – stan generowania fiszek i edycji kolekcji.
- **FlashcardProposalCard** – wyświetla pojedynczą propozycję fiszki AI (front/back) z akcjami „Akceptuj", „Odrzuć" i `Edytuj`.
- **FlashcardItem** – wyświetla pojedynczą fiszkę w kolekcji (front/back) z przyciskiem `Edytuj`.

---

_Ten plan UI zapewnia spójność z PRD, API i notatkami sesji, uwzględniając UX, dostępność (WCAG 2.1 AA) i bezpieczeństwo._
