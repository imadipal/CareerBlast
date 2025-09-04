-- Create skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    usage_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_skill_name ON skills(name);
CREATE INDEX idx_skill_category ON skills(category);
CREATE INDEX idx_skill_is_active ON skills(is_active);
CREATE INDEX idx_skill_usage_count ON skills(usage_count DESC);

-- Insert some common skills
INSERT INTO skills (name, category, description) VALUES
('Java', 'Programming Languages', 'Object-oriented programming language'),
('Python', 'Programming Languages', 'High-level programming language'),
('JavaScript', 'Programming Languages', 'Dynamic programming language for web development'),
('React', 'Frontend Frameworks', 'JavaScript library for building user interfaces'),
('Spring Boot', 'Backend Frameworks', 'Java framework for building microservices'),
('Node.js', 'Backend Technologies', 'JavaScript runtime for server-side development'),
('SQL', 'Databases', 'Structured Query Language for database management'),
('PostgreSQL', 'Databases', 'Open source relational database'),
('MongoDB', 'Databases', 'NoSQL document database'),
('AWS', 'Cloud Platforms', 'Amazon Web Services cloud platform'),
('Docker', 'DevOps', 'Containerization platform'),
('Kubernetes', 'DevOps', 'Container orchestration platform'),
('Git', 'Version Control', 'Distributed version control system'),
('Agile', 'Methodologies', 'Iterative software development methodology'),
('Scrum', 'Methodologies', 'Agile framework for project management');
