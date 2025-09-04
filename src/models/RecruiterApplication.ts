import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiterApplication extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  
  // Company information
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  companyDescription: string;
  companyLogo?: string;
  companyLogoS3Key?: string;
  
  // Personal information
  jobTitle: string;
  workEmail: string;
  phoneNumber: string;
  linkedinProfile: string;
  
  // Hiring information
  hiringNeeds: string;
  expectedHiringVolume?: number;
  hiringTimeframe?: string;
  
  // Documents
  documents: {
    businessLicense?: {
      url: string;
      s3Key: string;
      fileName: string;
      uploadedAt: Date;
    };
    identityProof?: {
      url: string;
      s3Key: string;
      fileName: string;
      uploadedAt: Date;
    };
    companyRegistration?: {
      url: string;
      s3Key: string;
      fileName: string;
      uploadedAt: Date;
    };
  };
  
  // Application status
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  approvalNotes?: string;
  
  // Email verification
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  emailVerifiedAt?: Date;
  
  // Admin notes and internal tracking
  internalNotes?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  
  // Follow-up tracking
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterApplicationSchema = new Schema<IRecruiterApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  
  // Company information
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true,
  },
  companyWebsite: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Invalid website URL',
    },
  },
  companySize: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'technology',
      'finance',
      'healthcare',
      'education',
      'retail',
      'manufacturing',
      'consulting',
      'media',
      'real-estate',
      'automotive',
      'energy',
      'telecommunications',
      'aerospace',
      'agriculture',
      'construction',
      'government',
      'non-profit',
      'other'
    ],
    index: true,
  },
  companyDescription: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  companyLogo: String,
  companyLogoS3Key: String,
  
  // Personal information
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  workEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format',
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  linkedinProfile: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(v);
      },
      message: 'Invalid LinkedIn profile URL',
    },
  },
  
  // Hiring information
  hiringNeeds: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  expectedHiringVolume: {
    type: Number,
    min: 1,
    max: 1000,
  },
  hiringTimeframe: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', '6-12-months', 'ongoing'],
  },
  
  // Documents
  documents: {
    businessLicense: {
      url: String,
      s3Key: String,
      fileName: String,
      uploadedAt: Date,
    },
    identityProof: {
      url: String,
      s3Key: String,
      fileName: String,
      uploadedAt: Date,
    },
    companyRegistration: {
      url: String,
      s3Key: String,
      fileName: String,
      uploadedAt: Date,
    },
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  reviewedAt: Date,
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: {
    type: String,
    maxlength: 1000,
  },
  approvalNotes: {
    type: String,
    maxlength: 1000,
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false,
    index: true,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  emailVerifiedAt: Date,
  
  // Admin notes and internal tracking
  internalNotes: {
    type: String,
    maxlength: 2000,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  
  // Follow-up tracking
  followUpRequired: {
    type: Boolean,
    default: false,
    index: true,
  },
  followUpDate: Date,
  followUpNotes: String,
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.emailVerificationToken;
      return ret;
    },
  },
});

// Indexes for better query performance
RecruiterApplicationSchema.index({ status: 1, submittedAt: -1 });
RecruiterApplicationSchema.index({ companyName: 'text', companyDescription: 'text' });
RecruiterApplicationSchema.index({ industry: 1, companySize: 1 });
RecruiterApplicationSchema.index({ reviewedBy: 1, reviewedAt: -1 });
RecruiterApplicationSchema.index({ followUpRequired: 1, followUpDate: 1 });

// Pre-save middleware to set reviewedAt when status changes
RecruiterApplicationSchema.pre('save', function(next) {
  if (this.isModified('status') && 
      (this.status === 'approved' || this.status === 'rejected') && 
      !this.reviewedAt) {
    this.reviewedAt = new Date();
  }
  next();
});

// Method to approve application
RecruiterApplicationSchema.methods.approve = function(reviewerId: string, notes?: string) {
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.approvalNotes = notes;
  this.rejectionReason = undefined;
  return this.save();
};

// Method to reject application
RecruiterApplicationSchema.methods.reject = function(reviewerId: string, reason: string) {
  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  this.approvalNotes = undefined;
  return this.save();
};

// Method to set under review
RecruiterApplicationSchema.methods.setUnderReview = function(reviewerId: string) {
  this.status = 'under_review';
  this.reviewedBy = reviewerId;
  return this.save();
};

// Static method to get applications by status
RecruiterApplicationSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).populate('userId', 'firstName lastName email').sort({ submittedAt: -1 });
};

// Static method to get pending applications
RecruiterApplicationSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).populate('userId', 'firstName lastName email').sort({ submittedAt: 1 });
};

// Static method to get applications requiring follow-up
RecruiterApplicationSchema.statics.findRequiringFollowUp = function() {
  return this.find({ 
    followUpRequired: true,
    followUpDate: { $lte: new Date() }
  }).populate('userId', 'firstName lastName email').sort({ followUpDate: 1 });
};

// Virtual for application age in days
RecruiterApplicationSchema.virtual('applicationAgeInDays').get(function() {
  const now = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = Math.abs(now.getTime() - submitted.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for review time in hours (if reviewed)
RecruiterApplicationSchema.virtual('reviewTimeInHours').get(function() {
  if (!this.reviewedAt) return null;
  const reviewed = new Date(this.reviewedAt);
  const submitted = new Date(this.submittedAt);
  const diffTime = Math.abs(reviewed.getTime() - submitted.getTime());
  return Math.round(diffTime / (1000 * 60 * 60) * 10) / 10; // Round to 1 decimal
});

export const RecruiterApplication = mongoose.model<IRecruiterApplication>('RecruiterApplication', RecruiterApplicationSchema);
export default RecruiterApplication;
