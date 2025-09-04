-- Add matching-related fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN profile_completion_percentage INTEGER NOT NULL DEFAULT 0,
ADD COLUMN is_profile_complete BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN matching_enabled BOOLEAN NOT NULL DEFAULT false;

-- Make expected_salary and experience_years required for matching
ALTER TABLE user_profiles 
ALTER COLUMN expected_salary SET NOT NULL,
ALTER COLUMN experience_years SET NOT NULL;

-- Add matching-related fields to jobs table
ALTER TABLE jobs 
ADD COLUMN actual_salary_min DECIMAL(10,2),
ADD COLUMN actual_salary_max DECIMAL(10,2),
ADD COLUMN salary_negotiable BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN matching_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN auto_match_candidates BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for matching performance
CREATE INDEX idx_user_profile_matching_enabled ON user_profiles(matching_enabled);
CREATE INDEX idx_user_profile_expected_salary ON user_profiles(expected_salary);
CREATE INDEX idx_user_profile_experience_years ON user_profiles(experience_years);
CREATE INDEX idx_user_profile_completion ON user_profiles(profile_completion_percentage);

CREATE INDEX idx_job_matching_enabled ON jobs(matching_enabled);
CREATE INDEX idx_job_actual_salary_range ON jobs(actual_salary_min, actual_salary_max);
CREATE INDEX idx_job_auto_match ON jobs(auto_match_candidates);

-- Update existing profiles to calculate completion percentage
-- This is a simplified calculation - in production you might want a more sophisticated approach
UPDATE user_profiles 
SET profile_completion_percentage = CASE 
    WHEN title IS NOT NULL AND summary IS NOT NULL AND expected_salary IS NOT NULL AND experience_years IS NOT NULL THEN 80
    WHEN title IS NOT NULL AND expected_salary IS NOT NULL AND experience_years IS NOT NULL THEN 60
    WHEN expected_salary IS NOT NULL AND experience_years IS NOT NULL THEN 40
    ELSE 20
END;

UPDATE user_profiles 
SET is_profile_complete = (profile_completion_percentage >= 80);

UPDATE user_profiles 
SET matching_enabled = (is_profile_complete AND expected_salary IS NOT NULL AND experience_years IS NOT NULL);
