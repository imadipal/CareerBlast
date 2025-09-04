// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'employer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Email verification
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
  // Recruiter-specific fields
  linkedinProfile?: string;
  companyName?: string;
  jobTitle?: string;
  // Recruiter approval system
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'candidate' | 'employer';
  linkedinProfile?: string; // Required for employers
  companyName?: string; // Required for employers
  jobTitle?: string; // Required for employers
}

export interface EmailVerification {
  email: string;
  otp: string;
  isVerified: boolean;
  sentAt: string;
  expiresAt: string;
  attempts: number;
}

export interface ForgotPasswordForm {
  email: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Job Related Types
export interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
    size?: string;
    industry?: string;
  };
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  experienceMin?: number;
  experienceMax?: number;
  experienceLevel?: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  expiresAt: string;
  isActive: boolean;
  applicationsCount: number;
  employerId: string;
}

export interface JobFilters {
  location?: string;
  experience?: string;
  salary?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  type?: string[];
  company?: string;
}

// Candidate Profile Types
export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  location: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  resume?: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryExpectation: {
      min: number;
      max: number;
      currency: string;
    };
    remoteWork?: boolean;
    hybridWork?: boolean;
  };
  isPublic: boolean;
  profileViews: number;
  matchingEnabled?: boolean;
  profileCompletionPercentage?: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

// Employer Types
export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  companySize: string;
  industry: string;
  website?: string;
  description: string;
  logo?: string;
  location: string;
  foundedYear?: number;
  jobsPosted: number;
  isVerified: boolean;
  subscriptionPlan?: 'basic' | 'premium' | 'enterprise';
  organizationId?: string;
}

// Organization and Team Management Types
export interface Organization {
  id: string;
  name: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  maxRecruiters: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  settings: {
    allowMultipleRecruiters: boolean;
    requireApprovalForNewMembers: boolean;
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'recruiter';
  status: 'active' | 'pending' | 'inactive';
  invitedAt: string;
  joinedAt?: string;
  invitedBy: string;
  permissions: {
    canPostJobs: boolean;
    canViewCandidates: boolean;
    canManageTeam: boolean;
    canViewAnalytics: boolean;
  };
}

export interface TeamInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: 'admin' | 'recruiter';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  token: string;
}

// Recruiter Verification System
export interface RecruiterApplication {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  jobTitle: string;
  workEmail: string;
  phoneNumber: string;
  linkedinProfile?: string;
  companyDescription: string;
  hiringNeeds: string;
  documents: {
    businessLicense?: string;
    companyLogo?: string;
    identityProof?: string;
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface RecruiterVerificationStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  averageReviewTime: number; // in hours
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'applied' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'candidate' | 'employer';
}

export interface ForgotPasswordForm {
  email: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Job Matching Types
export interface JobMatch {
  job: Job;
  matchPercentage: number;
  breakdown?: MatchBreakdown;
  matchExplanation?: string;
  isRecommended?: boolean;
  matchedSkills?: string[];
  salaryMatch?: boolean;
  experienceMatch?: boolean;
  locationMatch?: boolean;
}

export interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch?: number;
  responsibilitiesMatch?: number;
  locationMatch: number;
  salaryMatch?: number;
  overallMatch: number;

  // Detailed explanations
  skillsExplanation?: string;
  experienceExplanation?: string;
  educationExplanation?: string;
  responsibilitiesExplanation?: string;
  overallExplanation?: string;

  details?: {
    matchedSkills: string[];
    missingSkills: string[];
    experienceGap?: number;
    salaryGap?: number;
  };
}

// Matching statistics
export interface MatchingStats {
  totalJobs: number;
  matchedJobs: number;
  totalMatches?: number;
  averageMatchPercentage: number;
  topSkillsInDemand: string[];
  topSkills?: string[];
  matchingEnabled?: boolean;
  lastUpdated?: string;
  profileCompleteness?: number;
  recommendationsCount?: number;
  strictFiltersApplied?: {
    salaryFilter: boolean;
    experienceFilter: boolean;
  };
}

// Candidate Match Types (for recruiters)
export interface CandidateMatch {
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
    location?: string;
  };
  matchPercentage: number;
  breakdown?: MatchBreakdown;
  matchExplanation?: string;
  expectedSalary: number;
  experienceYears: number;
  hasApplied: boolean;
  applicationStatus?: string;
}
