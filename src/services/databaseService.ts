import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Job, { IJob } from '../models/Job';
import CandidateProfile, { ICandidateProfile } from '../models/CandidateProfile';
import RecruiterApplication, { IRecruiterApplication } from '../models/RecruiterApplication';
import JobApplication, { IJobApplication } from '../models/JobApplication';
import S3Service from '../config/s3';

export class DatabaseService {
  /**
   * User Management
   */
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  static async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(userId, updates, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  static async updateUserAvatar(userId: string, avatarFile: Buffer, fileName: string): Promise<string> {
    try {
      // Upload to S3
      const { url, key } = await S3Service.uploadFile(avatarFile, fileName, 'PROFILE_PICTURE', userId);
      
      // Update user record
      await User.findByIdAndUpdate(userId, {
        avatar: url,
        avatarS3Key: key,
      });
      
      return url;
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw new Error('Failed to update avatar');
    }
  }

  /**
   * Job Management
   */
  static async createJob(jobData: Partial<IJob>): Promise<IJob> {
    try {
      const job = new Job(jobData);
      await job.save();
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  }

  static async getJobById(jobId: string): Promise<IJob | null> {
    try {
      return await Job.findById(jobId).populate('postedBy', 'firstName lastName email companyName');
    } catch (error) {
      console.error('Error fetching job:', error);
      throw new Error('Failed to fetch job');
    }
  }

  static async getJobsByEmployer(employerId: string, page = 1, limit = 20): Promise<{ jobs: IJob[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const jobs = await Job.find({ postedBy: employerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Job.countDocuments({ postedBy: employerId });
      
      return { jobs, total };
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  static async searchJobs(filters: any, page = 1, limit = 20): Promise<{ jobs: IJob[]; total: number }> {
    try {
      const query: any = { isActive: true, status: 'published' };
      
      // Add filters
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.skills && filters.skills.length > 0) {
        query.skills = { $in: filters.skills };
      }
      if (filters.salaryMin || filters.salaryMax) {
        query['salary.min'] = {};
        if (filters.salaryMin) query['salary.min'].$gte = filters.salaryMin;
        if (filters.salaryMax) query['salary.max'] = { $lte: filters.salaryMax };
      }
      if (filters.search) {
        query.$text = { $search: filters.search };
      }
      
      const skip = (page - 1) * limit;
      const jobs = await Job.find(query)
        .sort({ postedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Job.countDocuments(query);
      
      return { jobs, total };
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  static async updateCompanyLogo(jobId: string, logoFile: Buffer, fileName: string): Promise<string> {
    try {
      const job = await Job.findById(jobId);
      if (!job) throw new Error('Job not found');
      
      // Upload to S3
      const { url, key } = await S3Service.uploadFile(logoFile, fileName, 'COMPANY_LOGO', job.postedBy.toString());
      
      // Update job record
      await Job.findByIdAndUpdate(jobId, {
        'company.logoUrl': url,
        'company.logoS3Key': key,
      });
      
      return url;
    } catch (error) {
      console.error('Error updating company logo:', error);
      throw new Error('Failed to update company logo');
    }
  }

  /**
   * Candidate Profile Management
   */
  static async createCandidateProfile(profileData: Partial<ICandidateProfile>): Promise<ICandidateProfile> {
    try {
      const profile = new CandidateProfile(profileData);
      await profile.save();
      return profile;
    } catch (error) {
      console.error('Error creating candidate profile:', error);
      throw new Error('Failed to create candidate profile');
    }
  }

  static async getCandidateProfile(userId: string): Promise<ICandidateProfile | null> {
    try {
      return await CandidateProfile.findOne({ userId }).populate('userId', 'firstName lastName email avatar');
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      throw new Error('Failed to fetch candidate profile');
    }
  }

  static async updateCandidateResume(userId: string, resumeFile: Buffer, fileName: string): Promise<string> {
    try {
      // Upload to S3
      const { url, key } = await S3Service.uploadFile(resumeFile, fileName, 'RESUME', userId);
      
      // Update profile record
      await CandidateProfile.findOneAndUpdate(
        { userId },
        {
          resumeUrl: url,
          resumeS3Key: key,
          resumeFileName: fileName,
          resumeUploadedAt: new Date(),
        }
      );
      
      return url;
    } catch (error) {
      console.error('Error updating candidate resume:', error);
      throw new Error('Failed to update resume');
    }
  }

  static async searchCandidates(filters: any, page = 1, limit = 20): Promise<{ candidates: ICandidateProfile[]; total: number }> {
    try {
      const query: any = { isPublic: true, isOpenToWork: true };
      
      // Add filters
      if (filters.skills && filters.skills.length > 0) {
        query.skills = { $in: filters.skills.map((skill: string) => skill.toLowerCase()) };
      }
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if (filters.experienceMin || filters.experienceMax) {
        // This would require a virtual field calculation or aggregation
        // For now, we'll use a simple approach
      }
      if (filters.salaryMin || filters.salaryMax) {
        if (filters.salaryMin) query.expectedSalary = { $gte: filters.salaryMin };
        if (filters.salaryMax) query.expectedSalary = { ...query.expectedSalary, $lte: filters.salaryMax };
      }
      
      const skip = (page - 1) * limit;
      const candidates = await CandidateProfile.find(query)
        .populate('userId', 'firstName lastName email avatar')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await CandidateProfile.countDocuments(query);
      
      return { candidates, total };
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw new Error('Failed to search candidates');
    }
  }

  /**
   * Recruiter Application Management
   */
  static async createRecruiterApplication(applicationData: Partial<IRecruiterApplication>): Promise<IRecruiterApplication> {
    try {
      const application = new RecruiterApplication(applicationData);
      await application.save();
      return application;
    } catch (error) {
      console.error('Error creating recruiter application:', error);
      throw new Error('Failed to create recruiter application');
    }
  }

  static async getRecruiterApplications(filters: any = {}, page = 1, limit = 20): Promise<{ applications: IRecruiterApplication[]; total: number }> {
    try {
      const query: any = {};
      
      if (filters.status) query.status = filters.status;
      if (filters.industry) query.industry = filters.industry;
      if (filters.priority) query.priority = filters.priority;
      
      const skip = (page - 1) * limit;
      const applications = await RecruiterApplication.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('reviewedBy', 'firstName lastName')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await RecruiterApplication.countDocuments(query);
      
      return { applications, total };
    } catch (error) {
      console.error('Error fetching recruiter applications:', error);
      throw new Error('Failed to fetch recruiter applications');
    }
  }

  static async approveRecruiterApplication(applicationId: string, reviewerId: string, notes?: string): Promise<void> {
    try {
      const application = await RecruiterApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      
      // Approve application
      await application.approve(reviewerId, notes);
      
      // Update user status
      await User.findByIdAndUpdate(application.userId, {
        isApproved: true,
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvedBy: reviewerId,
      });
    } catch (error) {
      console.error('Error approving recruiter application:', error);
      throw new Error('Failed to approve application');
    }
  }

  static async rejectRecruiterApplication(applicationId: string, reviewerId: string, reason: string): Promise<void> {
    try {
      const application = await RecruiterApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      
      // Reject application
      await application.reject(reviewerId, reason);
      
      // Update user status
      await User.findByIdAndUpdate(application.userId, {
        isApproved: false,
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvedBy: reviewerId,
      });
    } catch (error) {
      console.error('Error rejecting recruiter application:', error);
      throw new Error('Failed to reject application');
    }
  }

  /**
   * Job Application Management
   */
  static async createJobApplication(applicationData: Partial<IJobApplication>): Promise<IJobApplication> {
    try {
      const application = new JobApplication(applicationData);
      await application.save();
      
      // Increment job applications count
      await Job.findByIdAndUpdate(applicationData.jobId, {
        $inc: { applicationsCount: 1 }
      });
      
      return application;
    } catch (error) {
      console.error('Error creating job application:', error);
      throw new Error('Failed to create job application');
    }
  }

  static async getJobApplications(jobId: string, page = 1, limit = 20): Promise<{ applications: IJobApplication[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const applications = await JobApplication.find({ jobId })
        .populate('candidateId', 'firstName lastName email avatar')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await JobApplication.countDocuments({ jobId });
      
      return { applications, total };
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw new Error('Failed to fetch job applications');
    }
  }

  static async uploadJobApplicationResume(applicationId: string, resumeFile: Buffer, fileName: string): Promise<string> {
    try {
      const application = await JobApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      
      // Upload to S3
      const { url, key } = await S3Service.uploadFile(resumeFile, fileName, 'RESUME', application.candidateId.toString());
      
      // Update application record
      await JobApplication.findByIdAndUpdate(applicationId, {
        resumeUrl: url,
        resumeS3Key: key,
        resumeFileName: fileName,
      });
      
      return url;
    } catch (error) {
      console.error('Error uploading job application resume:', error);
      throw new Error('Failed to upload resume');
    }
  }

  /**
   * Analytics and Statistics
   */
  static async getDashboardStats(userId: string, userRole: string): Promise<any> {
    try {
      if (userRole === 'employer') {
        const [jobsCount, applicationsCount, activeJobsCount] = await Promise.all([
          Job.countDocuments({ postedBy: userId }),
          JobApplication.countDocuments({ employerId: userId }),
          Job.countDocuments({ postedBy: userId, isActive: true, status: 'published' }),
        ]);
        
        return {
          totalJobs: jobsCount,
          totalApplications: applicationsCount,
          activeJobs: activeJobsCount,
        };
      } else if (userRole === 'candidate') {
        const [applicationsCount, profileViews] = await Promise.all([
          JobApplication.countDocuments({ candidateId: userId }),
          CandidateProfile.findOne({ userId }).select('profileViews'),
        ]);
        
        return {
          totalApplications: applicationsCount,
          profileViews: profileViews?.profileViews || 0,
        };
      } else if (userRole === 'admin') {
        const [usersCount, jobsCount, applicationsCount, pendingRecruiters] = await Promise.all([
          User.countDocuments(),
          Job.countDocuments(),
          JobApplication.countDocuments(),
          RecruiterApplication.countDocuments({ status: 'pending' }),
        ]);
        
        return {
          totalUsers: usersCount,
          totalJobs: jobsCount,
          totalApplications: applicationsCount,
          pendingRecruiters,
        };
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }
}

export default DatabaseService;
