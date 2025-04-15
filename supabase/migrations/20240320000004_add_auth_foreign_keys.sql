-- Add foreign key constraints to auth.users
ALTER TABLE collections
    ADD CONSTRAINT collections_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id);

ALTER TABLE logs
    ADD CONSTRAINT logs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id); 