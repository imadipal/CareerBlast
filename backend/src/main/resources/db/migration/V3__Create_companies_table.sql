-- Create companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters VARCHAR(255),
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    employee_count INTEGER,
    culture_description TEXT,
    benefits_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_company_name ON companies(name);
CREATE INDEX idx_company_industry ON companies(industry);
CREATE INDEX idx_company_user_id ON companies(user_id);
CREATE INDEX idx_company_is_verified ON companies(is_verified);
CREATE INDEX idx_company_is_featured ON companies(is_featured);


