-- Insert sample admin user
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, is_email_verified) 
VALUES (
    gen_random_uuid(),
    'admin@careerblast.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  -- password: password
    'Admin',
    'User',
    'ADMIN',
    true,
    true
);

-- Insert sample employer user
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, is_email_verified) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'employer@techcorp.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  -- password: password
    'John',
    'Employer',
    'EMPLOYER',
    true,
    true
);

-- Insert sample job seeker user
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, is_email_verified) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'jobseeker@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  -- password: password
    'Jane',
    'Seeker',
    'USER',
    true,
    true
);

-- Insert sample company
INSERT INTO companies (id, user_id, name, description, industry, company_size, founded_year, headquarters, website_url, is_verified, is_featured) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    'TechCorp Solutions',
    'Leading technology company specializing in innovative software solutions and digital transformation.',
    'Technology',
    '501-1000',
    2010,
    'San Francisco, CA',
    'https://techcorp.com',
    true,
    true
);

-- Insert sample jobs
INSERT INTO jobs (id, company_id, title, description, requirements, job_type, location, salary_min, salary_max, currency, experience_min, experience_max, is_active, is_featured) 
VALUES 
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440003',
    'Senior Software Engineer',
    'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software applications.',
    'Bachelor''s degree in Computer Science or related field. 5+ years of experience in software development. Proficiency in Java, Spring Boot, and React.',
    'FULL_TIME',
    'San Francisco, CA',
    120000,
    180000,
    'USD',
    5,
    10,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    'Frontend Developer',
    'Join our frontend team to create amazing user experiences. You will work with modern technologies to build responsive and intuitive web applications.',
    'Experience with React, TypeScript, and modern CSS frameworks. Knowledge of responsive design principles.',
    'FULL_TIME',
    'Remote',
    80000,
    120000,
    'USD',
    2,
    5,
    true,
    false
);

-- Link jobs with skills
INSERT INTO job_skills (job_id, skill_id) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440004',
    s.id
FROM skills s 
WHERE s.name IN ('Java', 'Spring Boot', 'React', 'SQL', 'Git');

INSERT INTO job_skills (job_id, skill_id) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440005',
    s.id
FROM skills s 
WHERE s.name IN ('React', 'JavaScript', 'Git');

-- Insert sample user profile
INSERT INTO user_profiles (id, user_id, title, summary, experience_years, expected_salary, currency, is_open_to_remote) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    'Full Stack Developer',
    'Passionate full stack developer with 3 years of experience in building web applications using modern technologies.',
    3,
    90000,
    'USD',
    true
);

-- Link user profile with skills
INSERT INTO user_profile_skills (user_profile_id, skill_id) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440006',
    s.id
FROM skills s 
WHERE s.name IN ('JavaScript', 'React', 'Node.js', 'SQL', 'Git');
