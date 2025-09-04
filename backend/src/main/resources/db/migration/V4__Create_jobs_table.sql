-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'TEMPORARY')),
    location VARCHAR(255) NOT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT false,
    is_hybrid BOOLEAN NOT NULL DEFAULT false,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    experience_min INTEGER,
    experience_max INTEGER,
    education_level VARCHAR(100),
    application_deadline DATE,
    posted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    views_count BIGINT NOT NULL DEFAULT 0,
    applications_count BIGINT NOT NULL DEFAULT 0,
    external_url VARCHAR(500),
    contact_email VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_job_title ON jobs(title);
CREATE INDEX idx_job_location ON jobs(location);
CREATE INDEX idx_job_type ON jobs(job_type);
CREATE INDEX idx_job_is_active ON jobs(is_active);
CREATE INDEX idx_job_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_job_company_id ON jobs(company_id);
CREATE INDEX idx_job_is_featured ON jobs(is_featured);
CREATE INDEX idx_job_salary_range ON jobs(salary_min, salary_max);
CREATE INDEX idx_job_experience_range ON jobs(experience_min, experience_max);

-- Create job_skills junction table
CREATE TABLE job_skills (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- Create indexes for job_skills
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);
