-- Create flashcards table
CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER NOT NULL,
    front TEXT NOT NULL CHECK (LENGTH(front) <= 200),
    back TEXT NOT NULL CHECK (LENGTH(back) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_collection
        FOREIGN KEY (collection_id)
        REFERENCES collections(id)
);

-- Create index
CREATE INDEX idx_flashcards_collection_id ON flashcards(collection_id);

-- Enable RLS
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY flashcards_rls_policy ON flashcards
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM collections
            WHERE collections.id = flashcards.collection_id
            AND collections.user_id = auth.uid()
            AND collections.deleted_at IS NULL
        )
    );

-- Create updated_at trigger
CREATE TRIGGER update_flashcards_updated_at
    BEFORE UPDATE ON flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 