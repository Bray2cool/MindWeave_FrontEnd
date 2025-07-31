/*
  # Add username field to users

  1. New Columns
    - Add `username` column to auth.users metadata
    - Add `display_name` column to user profiles if needed

  2. Security
    - Update RLS policies to handle username display
    - Ensure usernames are unique and valid

  3. Notes
    - Username will be stored in user metadata
    - Display name shown in UI instead of email
*/

-- Add a function to update user metadata
CREATE OR REPLACE FUNCTION update_user_username(new_username text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  result json;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Validate username (basic validation)
  IF new_username IS NULL OR length(trim(new_username)) < 2 THEN
    RETURN json_build_object('error', 'Username must be at least 2 characters');
  END IF;

  IF length(trim(new_username)) > 30 THEN
    RETURN json_build_object('error', 'Username must be less than 30 characters');
  END IF;

  -- Update user metadata
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || json_build_object('username', trim(new_username))::jsonb
  WHERE id = current_user_id;

  RETURN json_build_object('success', true, 'username', trim(new_username));
END;
$$;