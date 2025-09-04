import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'employer' | 'admin';
  avatar?: string;
  avatarS3Key?: string;
  
  // Email verification
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  
  // Recruiter-specific fields
  linkedinProfile?: string;
  companyName?: string;
  jobTitle?: string;
  
  // Recruiter approval system
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  
  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Account status
  isActive: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  isLocked(): boolean;
  incLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'employer', 'admin'],
    required: true,
    default: 'candidate',
  },
  avatar: {
    type: String, // S3 URL
  },
  avatarS3Key: {
    type: String, // S3 key for deletion
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedAt: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Recruiter-specific fields
  linkedinProfile: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(v);
      },
      message: 'Invalid LinkedIn profile URL',
    },
  },
  companyName: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  
  // Recruiter approval system
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedAt: Date,
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: String,
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      return ret;
    },
  },
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ approvalStatus: 1 });
UserSchema.index({ isEmailVerified: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
UserSchema.methods.generateEmailVerificationToken = function(): string {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return token;
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Check if account is locked
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
UserSchema.methods.incLoginAttempts = async function(): Promise<void> {
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1, loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model<IUser>('User', UserSchema);
export default User;
