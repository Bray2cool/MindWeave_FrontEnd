/*
  # Fix AI Reflections RLS Policies

  The previous migration used incorrect RLS policy syntax.
  This migration drops and recreates the policies with correct syntax.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own AI reflections" ON ai_reflections;
DROP POLICY IF EXISTS "Users can insert their own AI reflections" ON ai_reflections;
DROP POLICY IF EXISTS "Users can update their own AI reflections" ON ai_reflections;
DROP POLICY IF EXISTS "Users can delete their own AI reflections" ON ai_reflections;

-- Recreate policies with correct syntax
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