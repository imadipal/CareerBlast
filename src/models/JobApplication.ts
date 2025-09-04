import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  _id: string;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  
  // Application details
  coverLetter?: string;
  resumeUrl?: string;
  resumeS3Key?: string;
  resumeFileName?: string;
  
  // Additional documents
  additionalDocuments: {
    name: string;
    url: string;
    s3Key: string;
    fileName: string;
    uploadedAt: Date;
  }[];
  
  // Application status
  status: 'applied' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired' | 'withdrawn';
  appliedAt: Date;
  
  // Status tracking
  statusHistory: {
    status: string;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    notes?: string;
  }[];
  
  // Interview scheduling
  interviews: {
    type: 'phone' | 'video' | 'onsite' | 'technical';
    scheduledAt: Date;
    duration: number; // in minutes
    location?: string;
    meetingLink?: string;
    interviewers: string[];
    notes?: string;
    feedback?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  }[];
  
  // Recruiter notes and feedback
  recruiterNotes?: string;
  internalNotes?: string;
  rating?: number; // 1-5 scale
  
  // Candidate responses
  candidateQuestions?: {
    question: string;
    answer: string;
  }[];
  
  // Salary negotiation
  salaryExpectation?: number;
  salaryOffered?: number;
  salaryCurrency: string;
  
  // Communication tracking
  lastContactedAt?: Date;
  lastContactMethod?: 'email' | 'phone' | 'message';
  communicationHistory: {
    type: 'email' | 'phone' | 'message' | 'interview' | 'meeting';
    subject?: string;
    content?: string;
    sentBy: mongoose.Types.ObjectId;
    sentAt: Date;
    isRead: boolean;
  }[];
  
  // Analytics
  viewedByEmployer: boolean;
  viewedAt?: Date;
  responseTime?: number; // Time taken to respond in hours
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  employerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Application details
  coverLetter: {
    type: String,
    maxlength: 5000,
  },
  resumeUrl: String,
  resumeS3Key: String,
  resumeFileName: String,
  
  // Additional documents
  additionalDocuments: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Application status
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired', 'withdrawn'],
    default: 'applied',
    index: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  // Status tracking
  statusHistory: [{
    status: {
      type: String,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: String,
  }],
  
  // Interview scheduling
  interviews: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical'],
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 480, // 8 hours max
    },
    location: String,
    meetingLink: String,
    interviewers: [String],
    notes: String,
    feedback: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
  }],
  
  // Recruiter notes and feedback
  recruiterNotes: {
    type: String,
    maxlength: 2000,
  },
  internalNotes: {
    type: String,
    maxlength: 2000,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  
  // Candidate responses
  candidateQuestions: [{
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  }],
  
  // Salary negotiation
  salaryExpectation: {
    type: Number,
    min: 0,
  },
  salaryOffered: {
    type: Number,
    min: 0,
  },
  salaryCurrency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  
  // Communication tracking
  lastContactedAt: Date,
  lastContactMethod: {
    type: String,
    enum: ['email', 'phone', 'message'],
  },
  communicationHistory: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'message', 'interview', 'meeting'],
      required: true,
    },
    subject: String,
    content: String,
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Analytics
  viewedByEmployer: {
    type: Boolean,
    default: false,
    index: true,
  },
  viewedAt: Date,
  responseTime: Number,
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

// Compound indexes for better query performance
JobApplicationSchema.index({ jobId: 1, status: 1 });
JobApplicationSchema.index({ candidateId: 1, appliedAt: -1 });
JobApplicationSchema.index({ employerId: 1, status: 1, appliedAt: -1 });
JobApplicationSchema.index({ status: 1, appliedAt: -1 });

// Unique constraint to prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// Pre-save middleware to track status changes
JobApplicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    // Add to status history
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: this.get('_lastModifiedBy') || this.candidateId, // Should be set by the controller
    });
  }
  
  // Set initial status history for new applications
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      changedAt: this.appliedAt,
      changedBy: this.candidateId,
    }];
  }
  
  next();
});

// Method to update status
JobApplicationSchema.methods.updateStatus = function(
  newStatus: string, 
  changedBy: string, 
  notes?: string
) {
  this.status = newStatus;
  this.set('_lastModifiedBy', changedBy);
  
  if (notes) {
    this.statusHistory[this.statusHistory.length - 1].notes = notes;
  }
  
  return this.save();
};

// Method to add communication
JobApplicationSchema.methods.addCommunication = function(
  type: string,
  sentBy: string,
  content?: string,
  subject?: string
) {
  this.communicationHistory.push({
    type,
    sentBy,
    content,
    subject,
    sentAt: new Date(),
    isRead: false,
  });
  
  this.lastContactedAt = new Date();
  this.lastContactMethod = type;
  
  return this.save();
};

// Method to schedule interview
JobApplicationSchema.methods.scheduleInterview = function(interviewData: any) {
  this.interviews.push(interviewData);
  
  // Update status to interviewed if not already
  if (this.status === 'applied' || this.status === 'reviewed' || this.status === 'shortlisted') {
    this.status = 'interviewed';
  }
  
  return this.save();
};

// Method to mark as viewed by employer
JobApplicationSchema.methods.markAsViewed = function() {
  if (!this.viewedByEmployer) {
    this.viewedByEmployer = true;
    this.viewedAt = new Date();
    
    // Calculate response time
    const appliedAt = new Date(this.appliedAt);
    const viewedAt = new Date();
    this.responseTime = Math.round((viewedAt.getTime() - appliedAt.getTime()) / (1000 * 60 * 60)); // in hours
  }
  
  return this.save();
};

// Static method to find applications by job
JobApplicationSchema.statics.findByJob = function(jobId: string) {
  return this.find({ jobId })
    .populate('candidateId', 'firstName lastName email avatar')
    .sort({ appliedAt: -1 });
};

// Static method to find applications by candidate
JobApplicationSchema.statics.findByCandidate = function(candidateId: string) {
  return this.find({ candidateId })
    .populate('jobId', 'title company location type')
    .sort({ appliedAt: -1 });
};

// Static method to find applications by employer
JobApplicationSchema.statics.findByEmployer = function(employerId: string) {
  return this.find({ employerId })
    .populate('candidateId', 'firstName lastName email avatar')
    .populate('jobId', 'title location type')
    .sort({ appliedAt: -1 });
};

// Virtual for application age in days
JobApplicationSchema.virtual('applicationAgeInDays').get(function() {
  const now = new Date();
  const applied = new Date(this.appliedAt);
  const diffTime = Math.abs(now.getTime() - applied.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for current interview
JobApplicationSchema.virtual('currentInterview').get(function() {
  if (!this.interviews || this.interviews.length === 0) return null;
  
  const now = new Date();
  return this.interviews.find(interview => 
    interview.status === 'scheduled' && new Date(interview.scheduledAt) > now
  ) || null;
});

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
export default JobApplication;
