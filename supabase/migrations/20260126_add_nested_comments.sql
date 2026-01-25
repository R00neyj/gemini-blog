-- Add parent_id to comments for nested replies
ALTER TABLE comments 
ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX comments_parent_id_idx ON comments(parent_id);
