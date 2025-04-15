# FlashMind Database Schema

## 1. Tables

### 1.1. collections
- **id**: SERIAL PRIMARY KEY
- **name**: VARCHAR NOT NULL
- **user_id**: UUID NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **deleted_at**: TIMESTAMPTZ NULL -- Soft delete: NULL indicates active

**Constraints:**
- Primary key on id

**Indexes:**
- CREATE INDEX idx_collections_user_id ON collections(user_id);

---

### 1.2. flashcards
- **id**: SERIAL PRIMARY KEY
- **collection_id**: INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE
- **front**: TEXT NOT NULL CHECK (LENGTH(front) <= 200)
- **back**: TEXT NOT NULL CHECK (LENGTH(back) <= 500)
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

**Constraints:**
- Primary key on id
- Foreign key (collection_id) referencing collections(id)

**Indexes:**
- CREATE INDEX idx_flashcards_collection_id ON flashcards(collection_id);

---

### 1.3. logs
- **id**: SERIAL PRIMARY KEY
- **user_id**: UUID NOT NULL
- **collection_id**: INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE
- **total_generated**: INTEGER NOT NULL
- **total_accepted**: INTEGER NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

**Constraints:**
- Primary key on id
- Foreign key (collection_id) referencing collections(id)

**Indexes:**
- CREATE INDEX idx_logs_user_id ON logs(user_id);
- CREATE INDEX idx_logs_collection_id ON logs(collection_id);

---

## 2. Relationships

- Each **collection** belongs to a single user (identified by `user_id`).
- Each **flashcard** belongs to one collection. (1:N relationship between collections and flashcards)
- Each **log** entry is associated with a collection and records generation details for a specific user.

---

## 3. Indexes Summary

- **collections**: Index on `user_id`.
- **flashcards**: Index on `collection_id`.
- **logs**: Index on `user_id` and an additional index on `collection_id`.

---

## 4. Row-Level Security (RLS) Policies

For enhanced data security, RLS is enabled on each table so that only the owner (as identified by `user_id`) can perform operations on their data.

### 4.1. collections
```sql
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY collections_rls_policy ON collections
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

### 4.2. flashcards
Flashcards do not store `user_id` directly. RLS is enforced by linking to the parent collection:
```sql
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY flashcards_rls_policy ON flashcards
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = flashcards.collection_id
        AND collections.user_id = current_setting('app.current_user_id')::uuid
    )
  );
```

### 4.3. logs
```sql
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY logs_rls_policy ON logs
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

---

## 5. Additional Notes

- **Normalization:** The schema is normalized to 3NF with clear entity relationships.
- **Soft Delete:** Implemented in the `collections` table via the `deleted_at` column (null indicates active records).
- **User Management:** User details are managed externally via Supabase Auth and referenced by `user_id`.
- **Timestamps:** Each table maintains `created_at` and `updated_at` for tracking changes.
- **Foreign Keys:** Cascading deletes ensure that related flashcards and logs are removed when a collection is deleted. 