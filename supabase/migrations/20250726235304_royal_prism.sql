/*
  # Create AI Reflections Table

  1. New Tables
    - `ai_reflections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `journal_entry_id` (uuid, foreign key to journal_entries, nullable)
      - `reflection_type` (text)
      - `reflection_content` (text)
      - `generated_at` (timestamp)

  2. Security
    - Enable RLS on `ai_reflections` table
    - Add policies for authenticated users to manage their own reflections

  3. Indexes
    - Add index on user_id and generated_at for efficient querying
*/

CREATE TABLE IF NOT EXISTS ai_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  journal_entry_id uuid REFERENCES journal_entries(id),
  reflection_type text NOT NULL,
  reflection_content text NOT NULL,
  generated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE ai_reflections ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS ai_reflections_user_id_generated_at_idx 
  ON ai_reflections (user_id, generated_at DESC);