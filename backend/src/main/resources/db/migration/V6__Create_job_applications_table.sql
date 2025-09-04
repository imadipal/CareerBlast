-- Create job_applications table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    cover_letter TEXT,
    resume_url VARCHAR(500),
    additional_documents_urls TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    interview_scheduled_at TIMESTAMP,
    interview_notes TEXT,
    feedback TEXT,
    rejection_reason TEXT,
    offer_details TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(user_id, job_id)
);

-- Create indexes
CREATE INDEX idx_application_user_job ON job_applications(user_id, job_id);
CREATE INDEX idx_application_status ON job_applications(status);
CREATE INDEX idx_application_applied_at ON job_applications(applied_at DESC);
CREATE INDEX idx_application_user_id ON job_applications(user_id);
CREATE INDEX idx_application_job_id ON job_applications(job_id);

-- Create user_saved_jobs junction table
CREATE TABLE user_saved_jobs (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
);

-- Create indexes for user_saved_jobs
CREATE INDEX idx_user_saved_jobs_user_id ON user_saved_jobs(user_id);
CREATE INDEX idx_user_saved_jobs_job_id ON user_saved_jobs(job_id);
CREATE INDEX idx_user_saved_jobs_saved_at ON user_saved_jobs(saved_at DESC);
