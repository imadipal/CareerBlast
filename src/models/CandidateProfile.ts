import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkExperience {
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  projectUrl?: string;
  githubUrl?: string;
  achievements: string[];
}

export interface ICandidateProfile extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  
  // Basic information
  title: string;
  summary: string;
  location: string;
  phone?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  
  // Resume
  resumeUrl?: string;
  resumeS3Key?: string;
  resumeFileName?: string;
  resumeUploadedAt?: Date;
  
  // Professional details
  currentSalary?: number;
  expectedSalary?: number;
  salaryCurrency: string;
  noticePeriod?: number; // in days
  availability: 'immediate' | 'within-2-weeks' | 'within-1-month' | 'within-3-months' | 'not-available';
  
  // Skills and expertise
  skills: string[];
  languages: {
    language: string;
    proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  }[];
  
  // Experience and education
  workExperience: IWorkExperience[];
  education: IEducation[];
  certifications: ICertification[];
  projects: IProject[];
  
  // Preferences
  jobTypes: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  preferredLocations: string[];
  remoteWork: 'yes' | 'no' | 'hybrid';
  willingToRelocate: boolean;
  
  // Profile status
  isPublic: boolean;
  isOpenToWork: boolean;
  profileCompletionPercentage: number;
  
  // Analytics
  profileViews: number;
  lastViewedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: { type: String, required: true },
  achievements: [{ type: String, trim: true }],
});

const EducationSchema = new Schema<IEducation>({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  grade: { type: String, trim: true },
  description: { type: String, trim: true },
});

const CertificationSchema = new Schema<ICertification>({
  name: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  credentialId: { type: String, trim: true },
  credentialUrl: { type: String, trim: true },
});

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  projectUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  achievements: [{ type: String, trim: true }],
});

const CandidateProfileSchema = new Schema<ICandidateProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  portfolioUrl: {
    type: String,
    trim: true,
  },
  
  // Resume
  resumeUrl: String,
  resumeS3Key: String,
  resumeFileName: String,
  resumeUploadedAt: Date,
  
  // Professional details
  currentSalary: {
    type: Number,
    min: 0,
  },
  expectedSalary: {
    type: Number,
    min: 0,
    index: true,
  },
  salaryCurrency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  noticePeriod: {
    type: Number,
    min: 0,
    max: 365,
  },
  availability: {
    type: String,
    enum: ['immediate', 'within-2-weeks', 'within-1-month', 'within-3-months', 'not-available'],
    default: 'within-1-month',
    index: true,
  },
  
  // Skills and expertise
  skills: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  languages: [{
    language: {
      type: String,
      required: true,
      trim: true,
    },
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      required: true,
    },
  }],
  
  // Experience and education
  workExperience: [WorkExperienceSchema],
  education: [EducationSchema],
  certifications: [CertificationSchema],
  projects: [ProjectSchema],
  
  // Preferences
  jobTypes: [{
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
  }],
  preferredLocations: [{
    type: String,
    trim: true,
  }],
  remoteWork: {
    type: String,
    enum: ['yes', 'no', 'hybrid'],
    default: 'hybrid',
  },
  willingToRelocate: {
    type: Boolean,
    default: false,
  },
  
  // Profile status
  isPublic: {
    type: Boolean,
    default: true,
    index: true,
  },
  isOpenToWork: {
    type: Boolean,
    default: true,
    index: true,
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  
  // Analytics
  profileViews: {
    type: Number,
    default: 0,
  },
  lastViewedAt: Date,
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for better query performance
CandidateProfileSchema.index({ skills: 1 });
CandidateProfileSchema.index({ location: 1 });
CandidateProfileSchema.index({ expectedSalary: 1 });
CandidateProfileSchema.index({ availability: 1 });
CandidateProfileSchema.index({ isPublic: 1, isOpenToWork: 1 });
CandidateProfileSchema.index({ 'workExperience.company': 1 });
CandidateProfileSchema.index({ 'education.institution': 1 });

// Pre-save middleware to calculate profile completion percentage
CandidateProfileSchema.pre('save', function(next) {
  let completionScore = 0;
  const maxScore = 100;
  
  // Basic information (30 points)
  if (this.title) completionScore += 5;
  if (this.summary && this.summary.length >= 100) completionScore += 10;
  if (this.location) completionScore += 5;
  if (this.phone) completionScore += 5;
  if (this.linkedinUrl) completionScore += 5;
  
  // Resume (20 points)
  if (this.resumeUrl) completionScore += 20;
  
  // Professional details (20 points)
  if (this.expectedSalary) completionScore += 5;
  if (this.availability) completionScore += 5;
  if (this.skills && this.skills.length >= 5) completionScore += 10;
  
  // Experience (20 points)
  if (this.workExperience && this.workExperience.length > 0) completionScore += 15;
  if (this.education && this.education.length > 0) completionScore += 5;
  
  // Additional (10 points)
  if (this.certifications && this.certifications.length > 0) completionScore += 5;
  if (this.projects && this.projects.length > 0) completionScore += 5;
  
  this.profileCompletionPercentage = Math.min(completionScore, maxScore);
  next();
});

// Method to increment profile views
CandidateProfileSchema.methods.incrementViews = function() {
  return this.updateOne({ 
    $inc: { profileViews: 1 },
    $set: { lastViewedAt: new Date() }
  });
};

// Static method to find candidates by skills
CandidateProfileSchema.statics.findBySkills = function(skills: string[]) {
  return this.find({
    isPublic: true,
    isOpenToWork: true,
    skills: { $in: skills.map(skill => skill.toLowerCase()) }
  });
};

// Virtual for total experience in years
CandidateProfileSchema.virtual('totalExperienceYears').get(function() {
  if (!this.workExperience || this.workExperience.length === 0) return 0;
  
  let totalMonths = 0;
  this.workExperience.forEach((exp: IWorkExperience) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate || Date.now());
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    totalMonths += Math.max(0, months);
  });
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
});

export const CandidateProfile = mongoose.model<ICandidateProfile>('CandidateProfile', CandidateProfileSchema);
export default CandidateProfile;
