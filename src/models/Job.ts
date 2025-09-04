import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  
  // Company information
  company: {
    id: mongoose.Types.ObjectId;
    name: string;
    logoUrl?: string;
    logoS3Key?: string;
    size?: string;
    industry?: string;
    website?: string;
  };
  
  // Job details
  location: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  experienceMin?: number;
  experienceMax?: number;
  
  // Salary information
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
    isNegotiable: boolean;
  };
  
  // Skills and categories
  skills: string[];
  categories: string[];
  tags: string[];
  
  // Application details
  applicationDeadline?: Date;
  applicationUrl?: string;
  applicationEmail?: string;
  applicationInstructions?: string;
  
  // Job status
  isActive: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  status: 'draft' | 'published' | 'paused' | 'closed' | 'expired';
  
  // Analytics
  views: number;
  applicationsCount: number;
  
  // SEO and metadata
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Posting details
  postedBy: mongoose.Types.ObjectId;
  postedAt: Date;
  expiresAt?: Date;
  lastModifiedBy?: mongoose.Types.ObjectId;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  responsibilities: [{
    type: String,
    trim: true,
  }],
  
  // Company information
  company: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: String,
    logoS3Key: String,
    size: String,
    industry: String,
    website: String,
  },
  
  // Job details
  location: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  locationType: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'onsite',
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true,
    index: true,
  },
  experience: {
    type: String,
    required: true,
  },
  experienceMin: {
    type: Number,
    min: 0,
    max: 50,
  },
  experienceMax: {
    type: Number,
    min: 0,
    max: 50,
  },
  
  // Salary information
  salary: {
    min: {
      type: Number,
      min: 0,
    },
    max: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
  },
  
  // Skills and categories
  skills: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  categories: [{
    type: String,
    trim: true,
    index: true,
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  
  // Application details
  applicationDeadline: Date,
  applicationUrl: String,
  applicationEmail: String,
  applicationInstructions: String,
  
  // Job status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'paused', 'closed', 'expired'],
    default: 'draft',
    index: true,
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  
  // SEO and metadata
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  metaTitle: String,
  metaDescription: String,
  
  // Posting details
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: Date,
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
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
JobSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
JobSchema.index({ location: 1, type: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ categories: 1 });
JobSchema.index({ postedAt: -1 });
JobSchema.index({ isActive: 1, status: 1 });
JobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
JobSchema.index({ experienceMin: 1, experienceMax: 1 });

// Pre-save middleware to generate slug
JobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Pre-save middleware to set postedAt when status changes to published
JobSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.postedAt) {
    this.postedAt = new Date();
  }
  next();
});

// Virtual for salary range display
JobSchema.virtual('salaryRange').get(function() {
  if (!this.salary.min && !this.salary.max) return null;
  
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (this.salary.min && this.salary.max) {
    return `${formatSalary(this.salary.min)} - ${formatSalary(this.salary.max)}`;
  } else if (this.salary.min) {
    return `From ${formatSalary(this.salary.min)}`;
  } else if (this.salary.max) {
    return `Up to ${formatSalary(this.salary.max)}`;
  }
  
  return null;
});

// Virtual for experience range display
JobSchema.virtual('experienceRange').get(function() {
  if (this.experienceMin !== undefined && this.experienceMax !== undefined) {
    if (this.experienceMin === this.experienceMax) {
      return `${this.experienceMin} years`;
    }
    return `${this.experienceMin}-${this.experienceMax} years`;
  } else if (this.experienceMin !== undefined) {
    return `${this.experienceMin}+ years`;
  } else if (this.experienceMax !== undefined) {
    return `Up to ${this.experienceMax} years`;
  }
  return this.experience;
});

// Method to increment view count
JobSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

// Method to increment applications count
JobSchema.methods.incrementApplications = function() {
  return this.updateOne({ $inc: { applicationsCount: 1 } });
};

// Static method to find active jobs
JobSchema.statics.findActive = function() {
  return this.find({ 
    isActive: true, 
    status: 'published',
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

export const Job = mongoose.model<IJob>('Job', JobSchema);
export default Job;
