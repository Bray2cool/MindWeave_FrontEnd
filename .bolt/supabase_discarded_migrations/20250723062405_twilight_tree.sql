/*
  # Create AI reflections table

  1. New Tables
    - `ai_reflections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `journal_entry_id` (uuid, foreign key to journal_entries, nullable for weekly reflections)
      - `reflection_type` (text, e.g., 'daily', 'weekly', 'feedback')
      - `reflection_content` (text, the AI-generated reflection)
      - `generated_at` (timestamp with time zone, when the reflection was created)

  2. Security
    - Enable RLS on `ai_reflections` table
    - Add policies for authenticated users to manage their own reflections
    - Users can SELECT, INSERT, UPDATE, DELETE only their own reflections

  3. Indexes
    - Add index on user_id and generated_at for efficient querying
    - Add index on journal_entry_id for linking reflections to specific entries
*/

-- Create the ai_reflections table
CREATE TABLE IF NOT EXISTS ai_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  journal_entry_id uuid,
  reflection_type text NOT NULL DEFAULT 'daily',
  reflection_content text NOT NULL,
  generated_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_reflections_user_id_fkey'
  ) THEN
    ALTER TABLE ai_reflections ADD CONSTRAINT ai_reflections_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_reflections_journal_entry_id_fkey'
  ) THEN
    ALTER TABLE ai_reflections ADD CONSTRAINT ai_reflections_journal_entry_id_fkey 
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraint for reflection_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_reflections_reflection_type_check'
  ) THEN
    ALTER TABLE ai_reflections ADD CONSTRAINT ai_reflections_reflection_type_check 
    CHECK (reflection_type IN ('daily', 'weekly', 'feedback', 'insight'));
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS ai_reflections_user_id_generated_at_idx 
ON ai_reflections (user_id, generated_at DESC);

CREATE INDEX IF NOT EXISTS ai_reflections_journal_entry_id_idx 
ON ai_reflections (journal_entry_id);

CREATE INDEX IF NOT EXISTS ai_reflections_reflection_type_idx 
ON ai_reflections (reflection_type);

-- Enable Row Level Security
ALTER TABLE ai_reflections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own AI reflections"
  ON ai_reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI reflections"
  ON ai_reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI reflections"
  ON ai_reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI reflections"
  ON ai_reflections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_ai_reflections_updated_at'
  ) THEN
    CREATE TRIGGER update_ai_reflections_updated_at
      BEFORE UPDATE ON ai_reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;