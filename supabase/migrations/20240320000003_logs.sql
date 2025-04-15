-- Create logs table
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    collection_id INTEGER NOT NULL,
    total_generated INTEGER NOT NULL,
    total_accepted INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_collection
        FOREIGN KEY (collection_id)
        REFERENCES collections(id)
);

-- Create indexes
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_collection_id ON logs(collection_id);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY logs_rls_policy ON logs
    FOR ALL
    USING (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM collections
            WHERE collections.id = logs.collection_id
            AND collections.deleted_at IS NULL
        )
    ); 