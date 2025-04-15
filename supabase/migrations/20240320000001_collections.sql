-- Create collections table
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create index
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY collections_rls_policy ON collections
    FOR ALL
    USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 