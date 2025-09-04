import type { CandidateProfile, WorkExperience, Education, Skill } from '../types';

export const mockWorkExperience: WorkExperience[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    position: 'Senior Frontend Developer',
    location: 'Bangalore, India',
    startDate: '2022-01-15',
    endDate: undefined,
    isCurrent: true,
    description: 'Leading frontend development for multiple client projects using React, TypeScript, and modern web technologies. Mentoring junior developers and establishing best practices for code quality and performance optimization.',
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    location: 'Mumbai, India',
    startDate: '2020-06-01',
    endDate: '2021-12-31',
    isCurrent: false,
    description: 'Developed responsive web applications using React and Redux. Collaborated with design and backend teams to deliver high-quality user experiences. Implemented automated testing and CI/CD pipelines.',
  },
  {
    id: '3',
    company: 'WebDev Agency',
    position: 'Junior Developer',
    location: 'Pune, India',
    startDate: '2019-03-01',
    endDate: '2020-05-31',
    isCurrent: false,
    description: 'Built websites and web applications using HTML, CSS, JavaScript, and jQuery. Worked on various client projects ranging from corporate websites to e-commerce platforms.',
  },
];

export const mockEducation: Education[] = [
  {
    id: '1',
    institution: 'Indian Institute of Technology, Bombay',
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering',
    startDate: '2015-07-01',
    endDate: '2019-05-31',
    grade: '8.5 CGPA',
    description: 'Specialized in software engineering and web technologies. Active member of the coding club and participated in multiple hackathons.',
  },
  {
    id: '2',
    institution: 'Delhi Public School',
    degree: 'Higher Secondary Certificate',
    field: 'Science (PCM)',
    startDate: '2013-04-01',
    endDate: '2015-03-31',
    grade: '92%',
    description: 'Focused on Mathematics, Physics, and Chemistry with Computer Science as an additional subject.',
  },
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React', level: 'expert', yearsOfExperience: 4 },
  { id: '2', name: 'TypeScript', level: 'advanced', yearsOfExperience: 3 },
  { id: '3', name: 'JavaScript', level: 'expert', yearsOfExperience: 5 },
  { id: '4', name: 'Node.js', level: 'advanced', yearsOfExperience: 3 },
  { id: '5', name: 'Python', level: 'intermediate', yearsOfExperience: 2 },
  { id: '6', name: 'GraphQL', level: 'intermediate', yearsOfExperience: 2 },
  { id: '7', name: 'AWS', level: 'intermediate', yearsOfExperience: 2 },
  { id: '8', name: 'Docker', level: 'beginner', yearsOfExperience: 1 },
  { id: '9', name: 'Redux', level: 'advanced', yearsOfExperience: 3 },
  { id: '10', name: 'Next.js', level: 'advanced', yearsOfExperience: 2 },
];

export const mockCandidateProfile: CandidateProfile = {
  id: 'candidate-1',
  userId: 'user-1',
  headline: 'Senior Frontend Developer with 5+ years of experience',
  summary: 'Passionate frontend developer with expertise in React, TypeScript, and modern web technologies. I love creating intuitive user interfaces and solving complex problems. Always eager to learn new technologies and contribute to innovative projects.',
  location: 'Bangalore, India',
  experience: mockWorkExperience,
  education: mockEducation,
  skills: mockSkills,
  resume: {
    url: '/resumes/john-doe-resume.pdf',
    filename: 'john-doe-resume.pdf',
    uploadedAt: '2024-01-10T10:00:00Z',
  },
  preferences: {
    jobTypes: ['full-time', 'contract'],
    locations: ['Bangalore', 'Mumbai', 'Remote'],
    salaryExpectation: {
      min: 1500000,
      max: 2500000,
      currency: 'INR',
    },
    remoteWork: true,
    hybridWork: true,
  },

  // Profile completion tracking
  profileCompletionPercentage: 85,

  // Matching preferences
  matchingEnabled: true,

  isPublic: true,
  profileViews: 156,
};
