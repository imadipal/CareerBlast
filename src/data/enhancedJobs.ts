import type { Job } from '../types';

export const enhancedMockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: {
      id: 'comp-1',
      name: 'TechCorp Solutions',
      logoUrl: 'https://via.placeholder.com/64x64?text=TC',
      size: '100-500',
      industry: 'Technology'
    },
    location: 'Bangalore',
    jobType: 'full-time',
    
    // Public salary range (visible to candidates)
    salaryMin: 800000,
    salaryMax: 1200000,
    currency: 'INR',
    
    // Private salary range (for matching only)
    actualSalaryMin: 900000,
    actualSalaryMax: 1400000,
    salaryNegotiable: true,
    
    // Experience requirements
    experienceMin: 3,
    experienceMax: 5,
    experienceLevel: 'mid',
    
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js'],
    description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience with React.js',
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model',
      'Experience with popular React.js workflows (such as Flux or Redux)',
      'Familiarity with newer specifications of EcmaScript'
    ],
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries for future use',
      'Translate designs and wireframes into high quality code',
      'Optimize components for maximum performance across devices'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Flexible working hours',
      'Remote work options',
      'Professional development opportunities'
    ],
    postedAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    isActive: true,
    applicationsCount: 45,
    employerId: 'emp-1',
    
    // Matching configuration
    matchingEnabled: true,
    autoMatchCandidates: true
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: {
      id: 'comp-2',
      name: 'StartupXYZ',
      logoUrl: 'https://via.placeholder.com/64x64?text=SX',
      size: '10-50',
      industry: 'Fintech'
    },
    location: 'Mumbai',
    jobType: 'full-time',
    
    // Public salary range
    salaryMin: 1000000,
    salaryMax: 1600000,
    currency: 'INR',
    
    // Private salary range
    actualSalaryMin: 1200000,
    actualSalaryMax: 1800000,
    salaryNegotiable: true,
    
    // Experience requirements
    experienceMin: 2,
    experienceMax: 4,
    experienceLevel: 'mid',
    
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
    description: 'Join our fast-growing fintech startup as a Full Stack Engineer. You\'ll work on cutting-edge financial products that serve millions of users.',
    requirements: [
      '2+ years of full-stack development experience',
      'Proficiency in React and Node.js',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, GCP)',
      'Understanding of financial systems is a plus'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Work with product team to define feature requirements',
      'Implement secure payment processing systems',
      'Optimize application performance and scalability'
    ],
    benefits: [
      'Competitive salary + equity',
      'Health and dental insurance',
      'Flexible work arrangements',
      'Learning stipend',
      'Stock options'
    ],
    postedAt: '2024-01-12T08:00:00Z',
    expiresAt: '2024-02-12T23:59:59Z',
    isActive: true,
    applicationsCount: 32,
    employerId: 'emp-2',
    
    matchingEnabled: true,
    autoMatchCandidates: true
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: {
      id: 'comp-3',
      name: 'CloudTech Inc',
      logoUrl: 'https://via.placeholder.com/64x64?text=CT',
      size: '500-1000',
      industry: 'Cloud Services'
    },
    location: 'Hyderabad',
    jobType: 'full-time',
    
    // Public salary range
    salaryMin: 1200000,
    salaryMax: 1800000,
    currency: 'INR',
    
    // Private salary range
    actualSalaryMin: 1400000,
    actualSalaryMax: 2200000,
    salaryNegotiable: false,
    
    // Experience requirements
    experienceMin: 4,
    experienceMax: 7,
    experienceLevel: 'senior',
    
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python'],
    description: 'We are seeking an experienced DevOps Engineer to join our cloud infrastructure team. You will be responsible for building and maintaining scalable, reliable systems.',
    requirements: [
      '4+ years of DevOps/Infrastructure experience',
      'Strong experience with AWS services',
      'Proficiency in containerization (Docker, Kubernetes)',
      'Experience with Infrastructure as Code (Terraform)',
      'Knowledge of CI/CD pipelines'
    ],
    responsibilities: [
      'Design and implement cloud infrastructure',
      'Automate deployment and monitoring processes',
      'Ensure system reliability and performance',
      'Collaborate with development teams on best practices'
    ],
    benefits: [
      'Competitive compensation',
      'Comprehensive health benefits',
      'Remote work flexibility',
      'Professional certifications support',
      'Annual performance bonus'
    ],
    postedAt: '2024-01-10T12:00:00Z',
    expiresAt: '2024-02-10T23:59:59Z',
    isActive: true,
    applicationsCount: 28,
    employerId: 'emp-3',
    
    matchingEnabled: true,
    autoMatchCandidates: true
  },
  {
    id: '4',
    title: 'Junior Frontend Developer',
    company: {
      id: 'comp-4',
      name: 'WebStudio Pro',
      logoUrl: 'https://via.placeholder.com/64x64?text=WS',
      size: '50-100',
      industry: 'Digital Agency'
    },
    location: 'Pune',
    jobType: 'full-time',
    
    // Public salary range
    salaryMin: 400000,
    salaryMax: 700000,
    currency: 'INR',
    
    // Private salary range
    actualSalaryMin: 500000,
    actualSalaryMax: 800000,
    salaryNegotiable: true,
    
    // Experience requirements
    experienceMin: 1,
    experienceMax: 2,
    experienceLevel: 'entry',
    
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design'],
    description: 'Perfect opportunity for a junior developer to grow their skills in a supportive environment. You\'ll work on diverse client projects and learn from experienced developers.',
    requirements: [
      '1-2 years of frontend development experience',
      'Strong foundation in HTML, CSS, and JavaScript',
      'Basic knowledge of React or similar framework',
      'Understanding of responsive design principles',
      'Eagerness to learn and grow'
    ],
    responsibilities: [
      'Develop responsive web interfaces',
      'Collaborate with designers and senior developers',
      'Write clean, maintainable code',
      'Participate in code reviews and team meetings'
    ],
    benefits: [
      'Mentorship program',
      'Health insurance',
      'Flexible hours',
      'Learning budget',
      'Career growth opportunities'
    ],
    postedAt: '2024-01-18T09:00:00Z',
    expiresAt: '2024-02-18T23:59:59Z',
    isActive: true,
    applicationsCount: 67,
    employerId: 'emp-4',
    
    matchingEnabled: true,
    autoMatchCandidates: true
  },
  {
    id: '5',
    title: 'Senior Backend Engineer',
    company: {
      id: 'comp-5',
      name: 'DataFlow Systems',
      logoUrl: 'https://via.placeholder.com/64x64?text=DF',
      size: '200-500',
      industry: 'Data Analytics'
    },
    location: 'Chennai',
    jobType: 'full-time',
    
    // Public salary range
    salaryMin: 1500000,
    salaryMax: 2200000,
    currency: 'INR',
    
    // Private salary range
    actualSalaryMin: 1800000,
    actualSalaryMax: 2500000,
    salaryNegotiable: true,
    
    // Experience requirements
    experienceMin: 5,
    experienceMax: 8,
    experienceLevel: 'senior',
    
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL'],
    description: 'Join our backend team to build high-performance, scalable systems that process millions of data points daily. Work with cutting-edge technologies in a data-driven environment.',
    requirements: [
      '5+ years of backend development experience',
      'Strong expertise in Java and Spring ecosystem',
      'Experience with microservices architecture',
      'Knowledge of message queues and caching systems',
      'Understanding of database optimization'
    ],
    responsibilities: [
      'Design and implement scalable backend services',
      'Optimize system performance and reliability',
      'Mentor junior developers',
      'Collaborate on architecture decisions'
    ],
    benefits: [
      'Competitive salary + bonus',
      'Premium health insurance',
      'Work from home options',
      'Conference attendance support',
      'Stock options'
    ],
    postedAt: '2024-01-08T14:00:00Z',
    expiresAt: '2024-02-08T23:59:59Z',
    isActive: true,
    applicationsCount: 23,
    employerId: 'emp-5',
    
    matchingEnabled: true,
    autoMatchCandidates: true
  }
];
