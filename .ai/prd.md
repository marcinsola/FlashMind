# Dokument wymagań produktu (PRD) - FlashMind

## 1. Przegląd produktu

FlashMind to aplikacja webowa wspierająca efektywną naukę poprzez system powtórek rozłożonych w czasie (spaced repetition). Głównym celem jest umożliwienie szybkiego i intuicyjnego tworzenia fiszek edukacyjnych z wykorzystaniem sztucznej inteligencji (AI), aby zredukować czasochłonność manualnego tworzenia fiszek oraz zwiększyć dostępność tej metody dla szerszego grona użytkowników.

Produkt umożliwia:
- Automatyczne generowanie fiszek na podstawie wprowadzonego tekstu
- Ręczne tworzenie, edytowanie i zarządzanie fiszkami
- Przechowywanie kolekcji w powiązaniu z kontem użytkownika
- Uczenie się fiszek z wykorzystaniem istniejącego algorytmu powtórek (open source)

## 2. Problem użytkownika

Tworzenie wysokiej jakości fiszek edukacyjnych wymaga czasu i wiedzy merytorycznej, co zniechęca wielu użytkowników do korzystania z tej efektywnej metody nauki. Użytkownicy szukają narzędzia, które pozwoli im w prosty sposób generować, zarządzać i wykorzystywać fiszki, bez konieczności ręcznego ich przygotowywania. Istnieje również potrzeba wsparcia procesu nauki przez automatyzację i personalizację materiału.

## 3. Wymagania funkcjonalne

### 3.1 Generowanie fiszek AI
- Możliwość wprowadzenia tekstu źródłowego (do 10000 znaków)
- Użytkownik określa liczbę fiszek do wygenerowania (1–200)
- System generuje fiszki w formacie pytanie/odpowiedź
- Weryfikacja długości fiszek (max. 200 znaków przód, 500 znaków tył)
- Automatyczna próba skrócenia zbyt długich fiszek

### 3.2 Zarządzanie fiszkami
- Akceptowanie, odrzucanie, edytowanie fiszek
- Regenerowanie wyłącznie brakujących fiszek
- Użytkownik może cofnąć akceptację pojedynczych fiszek przed finalnym zatwierdzeniem
- Fiszki nie są zapisywane dopóki nie zostaną zatwierdzone przyciskiem „Zatwierdź”
- Ostrzeżenie o utracie danych przy próbie opuszczenia strony bez zapisu

### 3.3 Obsługa kont użytkowników
- Rejestracja, logowanie, wylogowywanie
- Powiązanie kolekcji fiszek z kontem użytkownika
- Logowanie metadanych (data, liczba wygenerowanych i zaakceptowanych fiszek, liczba prób, ID użytkownika)

### 3.4 Nauka i powtórki
- Integracja z zewnętrznym, gotowym algorytmem nauki opartym o spaced repetition
- Współpraca z bazą danych użytkownika i kolekcji

### 3.5 Interfejs użytkownika
- Intuicyjny UI z oznaczeniami statusu fiszek
- Stan ładowania w trakcie generowania
- Animacje/odświeżanie przy zmianach fiszek
- Blokada interfejsu podczas operacji backendowych

## 4. Granice produktu

### 4.1 Zakres MVP
- Webowa aplikacja z podstawowym systemem kont użytkowników
- Generowanie fiszek AI i manualna edycja
- Przeglądanie, edytowanie, usuwanie fiszek
- Podstawowa integracja z algorytmem powtórek

### 4.2 Poza zakresem MVP
- Zaawansowany autorski algorytm powtórek (np. jak SuperMemo/Anki)
- Import z formatów PDF, DOCX, itp.
- Udostępnianie fiszek innym użytkownikom
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne

### 4.3 Nierozwiązane kwestie
- Zarządzanie kosztami i limitami API
- Strategia retry dla błędów API
- Sposób wymiany danych z algorytmem powtórek

## 5. Historyjki użytkowników

### US-001
- Tytuł: Logowanie i rejestracja
- Opis: Jako nowy użytkownik chcę się zarejestrować i logować, aby mieć dostęp do swoich kolekcji fiszek.
- Kryteria akceptacji:
  - Użytkownik może zarejestrować konto z e-mailem i hasłem
  - Użytkownik może się zalogować i wylogować
  - Sesja użytkownika jest przechowywana bezpiecznie

### US-002
- Tytuł: Wprowadzenie tekstu źródłowego
- Opis: Jako użytkownik chcę wkleić tekst i określić liczbę fiszek do wygenerowania, aby otrzymać dopasowane fiszki edukacyjne.
- Kryteria akceptacji:
  - Pole tekstowe przyjmuje do 10000 znaków
  - Pole wyboru liczby fiszek (1–200)
  - Po zatwierdzeniu następuje wywołanie API i otrzymanie fiszek

### US-003
- Tytuł: Walidacja długości fiszek
- Opis: Jako użytkownik chcę, by fiszki były automatycznie dostosowane do limitu znaków.
- Kryteria akceptacji:
  - Jeśli fiszka przekracza limit, następuje próba jej skrócenia
  - Jeśli skrócenie się nie uda, użytkownik widzi komunikat i może zignorować lub edytować

### US-004
- Tytuł: Zarządzanie fiszkami
- Opis: Jako użytkownik chcę móc akceptować, odrzucać i edytować fiszki, aby kontrolować ich jakość.
- Kryteria akceptacji:
  - Każda fiszka ma przyciski „Akceptuj”, „Odrzuć”, „Edytuj”
  - Użytkownik może cofnąć wcześniejszą decyzję

### US-005
- Tytuł: Regenerowanie fiszek
- Opis: Jako użytkownik chcę regenerować tylko brakujące fiszki, aby oszczędzać czas i limity API.
- Kryteria akceptacji:
  - Tylko odrzucone/brakujące fiszki są generowane ponownie
  - Akceptowane fiszki nie są nadpisywane

### US-006
- Tytuł: Finalizacja kolekcji
- Opis: Jako użytkownik chcę zatwierdzić kolekcję fiszek, aby zapisać ją w systemie.
- Kryteria akceptacji:
  - Przycisk „Zatwierdź” zapisuje kolekcję
  - Ostrzeżenie pojawia się przy próbie opuszczenia strony bez zatwierdzenia

### US-007
- Tytuł: Nauka z fiszek
- Opis: Jako użytkownik chcę móc powtarzać fiszki według systemu powtórek, aby efektywnie się uczyć.
- Kryteria akceptacji:
  - Zintegrowana strona nauki wyświetla fiszki zgodnie z harmonogramem
  - Dane są wymieniane z gotowym algorytmem nauki

### US-008
- Tytuł: Obsługa błędów API
- Opis: Jako użytkownik chcę otrzymywać jasne komunikaty o błędach, aby wiedzieć, co poszło nie tak.
- Kryteria akceptacji:
  - W przypadku błędu API użytkownik otrzymuje komunikat
  - Możliwość ponowienia próby

## 6. Metryki sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkownika (mierzone na poziomie kolekcji)
- 75% wszystkich fiszek tworzonych przez użytkowników pochodzi z generacji AI
- Średni czas utworzenia kompletnej kolekcji nie przekracza 5 minut
- Minimum 100 aktywnych użytkowników tygodniowo w ciągu pierwszych 2 miesięcy po wdrożeniu MVP
- Liczba błędów API poniżej 2% w miesięcznym ujęciu
