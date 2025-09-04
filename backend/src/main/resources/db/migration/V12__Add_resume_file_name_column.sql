-- Add resume_file_name column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN resume_file_name VARCHAR(255);
