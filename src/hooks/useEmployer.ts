import { useState, useEffect, useCallback } from 'react';
import type { Job, JobApplication, EmployerProfile } from '../types';
// import { employersAPI, jobsAPI } from '../services/api';
import { mockJobs } from '../data/jobs';
import { mockJobApplications, mockEmployerProfile } from '../data/employers';

interface UseEmployerDashboardReturn {
  jobs: Job[];
  applications: JobApplication[];
  profile: EmployerProfile | null;
  stats: {
    activeJobs: number;
    totalApplications: number;
    profileViews: number;
    hiredCandidates: number;
  };
  loading: boolean;
  error: string | null;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<void>;
  refetch: () => void;
}

export const useEmployerDashboard = (): UseEmployerDashboardReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    profileViews: 0,
    hiredCandidates: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      // In production, uncomment the API calls below
      
      // const [jobsResponse, applicationsResponse, profileResponse, statsResponse] = await Promise.all([
      //   employersAPI.getJobs(),
      //   employersAPI.getApplications(),
      //   employersAPI.getProfile(),
      //   employersAPI.getDashboardStats(),
      // ]);

      // Mock implementation
      setJobs(mockJobs);
      setApplications(mockJobApplications);
      setProfile(mockEmployerProfile);
      
      // Calculate stats from mock data
      const activeJobs = mockJobs.filter(job => job.isActive).length;
      const totalApplications = mockJobApplications.length;
      const hiredCandidates = mockJobApplications.filter(app => app.status === 'hired').length;
      
      setStats({
        activeJobs,
        totalApplications,
        profileViews: 1250, // Mock data
        hiredCandidates,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const createJob = async (jobData: Partial<Job>) => {
    try {
      // For demo purposes, add to local state
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: jobData.title || '',
        company: {
          id: profile?.id || 'comp-default',
          name: profile?.companyName || 'Company',
          logoUrl: profile?.logo,
          size: profile?.companySize,
          industry: profile?.industry
        },
        location: jobData.location || '',
        type: (jobData as any).type || 'full-time',
        jobType: (jobData as any).type || 'full-time',
        experience: `${jobData.experienceMin || 0}-${jobData.experienceMax || 0} years`,
        experienceMin: jobData.experienceMin,
        experienceMax: jobData.experienceMax,
        experienceLevel: jobData.experienceLevel,
        salary: {
          min: jobData.salaryMin || 0,
          max: jobData.salaryMax || 0,
          currency: jobData.currency || 'INR',
        },
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        currency: jobData.currency || 'INR',
        skills: jobData.skills || [],
        description: jobData.description || '',
        requirements: jobData.requirements || [],
        benefits: jobData.benefits || [],
        postedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        applicationsCount: 0,
        employerId: profile?.id || 'emp1',
      };

      setJobs(prev => [newJob, ...prev]);
      
      // In production, use API call:
      // await jobsAPI.createJob(jobData);
      // await fetchDashboardData(); // Refetch to get updated data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create job');
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      setJobs(prev => prev.map(job => 
        job.id === id ? { ...job, ...jobData } : job
      ));

      // In production, use API call:
      // await jobsAPI.updateJob(id, jobData);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update job');
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setJobs(prev => prev.filter(job => job.id !== id));

      // In production, use API call:
      // await jobsAPI.deleteJob(id);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']) => {
    try {
      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status } : app
      ));

      // Update stats if status changed to hired
      if (status === 'hired') {
        setStats(prev => ({ ...prev, hiredCandidates: prev.hiredCandidates + 1 }));
      }

      // In production, use API call:
      // await employersAPI.updateApplicationStatus(applicationId, status);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update application status');
    }
  };

  return {
    jobs,
    applications,
    profile,
    stats,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    updateApplicationStatus,
    refetch: fetchDashboardData,
  };
};

// Hook for managing employer profile
export const useEmployerProfile = () => {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      setProfile(mockEmployerProfile);
      
      // In production, use API call:
      // const response = await employersAPI.getProfile();
      // setProfile(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData: Partial<EmployerProfile>) => {
    try {
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      // In production, use API call:
      // await employersAPI.updateProfile(profileData);
      // await fetchProfile(); // Refetch to get updated data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
};

// Hook for job applications management
export const useJobApplications = (jobId?: string) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, filter mock data
      let filteredApplications = mockJobApplications;
      if (jobId) {
        filteredApplications = mockJobApplications.filter(app => app.jobId === jobId);
      }
      setApplications(filteredApplications);
      
      // In production, use API call:
      // const response = await employersAPI.getApplications(jobId);
      // setApplications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};
