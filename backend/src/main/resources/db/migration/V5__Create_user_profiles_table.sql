-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    summary TEXT,
    experience_years INTEGER,
    current_salary DECIMAL(10,2),
    expected_salary DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    availability_date DATE,
    is_open_to_remote BOOLEAN NOT NULL DEFAULT false,
    is_open_to_relocation BOOLEAN NOT NULL DEFAULT false,
    preferred_locations TEXT,
    resume_url VARCHAR(500),
    cover_letter_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_user_profile_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profile_experience_years ON user_profiles(experience_years);
CREATE INDEX idx_user_profile_expected_salary ON user_profiles(expected_salary);

-- Create user_profile_skills junction table
CREATE TABLE user_profile_skills (
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_profile_id, skill_id)
);

-- Create indexes for user_profile_skills
CREATE INDEX idx_user_profile_skills_profile_id ON user_profile_skills(user_profile_id);
CREATE INDEX idx_user_profile_skills_skill_id ON user_profile_skills(skill_id);

-- Create work_experiences table
CREATE TABLE work_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    location VARCHAR(255),
    company_url VARCHAR(500),
    achievements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes for work_experiences
CREATE INDEX idx_work_experience_user_profile_id ON work_experiences(user_profile_id);
CREATE INDEX idx_work_experience_start_date ON work_experiences(start_date DESC);

-- Create educations table
CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    grade VARCHAR(50),
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes for educations
CREATE INDEX idx_education_user_profile_id ON educations(user_profile_id);
CREATE INDEX idx_education_start_date ON educations(start_date DESC);

-- Create certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(500),
    description TEXT,
    does_not_expire BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes for certifications
CREATE INDEX idx_certification_user_profile_id ON certifications(user_profile_id);
CREATE INDEX idx_certification_issue_date ON certifications(issue_date DESC);
