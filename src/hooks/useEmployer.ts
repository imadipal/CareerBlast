import { useState, useEffect, useCallback } from 'react';
import type { Job, JobApplication, EmployerProfile } from '../types';
import { employersAPI, jobsAPI } from '../services/api';

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
      // Real API calls for production
      const [jobsResponse, applicationsResponse, profileResponse, statsResponse] = await Promise.all([
        employersAPI.getJobs(),
        employersAPI.getApplications(),
        employersAPI.getProfile(),
        employersAPI.getDashboardStats(),
      ]);

      // Set data from API responses
      if (jobsResponse.success) {
        setJobs(jobsResponse.data || []);
      }
      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data || []);
      }
      if (profileResponse.success) {
        setProfile(profileResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data || {
          activeJobs: 0,
          totalApplications: 0,
          profileViews: 0,
          hiredCandidates: 0,
        });
      }
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
      // Real API call for production
      const response = await jobsAPI.createJob(jobData);
      if (response.success) {
        setJobs(prev => [response.data, ...prev]);
        // Update stats
        setStats(prev => ({
          ...prev,
          activeJobs: prev.activeJobs + 1
        }));
      } else {
        throw new Error(response.message || 'Failed to create job');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      // Real API call for production
      const response = await jobsAPI.updateJob(id, jobData);
      if (response.success) {
        setJobs(prev => prev.map(job =>
          job.id === id ? { ...job, ...response.data } : job
        ));
      } else {
        throw new Error(response.message || 'Failed to update job');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      // Real API call for production
      const response = await jobsAPI.deleteJob(id);
      if (response.success) {
        setJobs(prev => prev.filter(job => job.id !== id));
        // Update stats
        setStats(prev => ({
          ...prev,
          activeJobs: prev.activeJobs - 1
        }));
      } else {
        throw new Error(response.message || 'Failed to delete job');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      throw err;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']) => {
    try {
      // Real API call for production
      const response = await employersAPI.updateApplicationStatus(applicationId, status);
      if (response.success) {
        setApplications(prev => prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        ));

        // Update stats if status changed to hired
        if (status === 'hired') {
          setStats(prev => ({ ...prev, hiredCandidates: prev.hiredCandidates + 1 }));
        }
      } else {
        throw new Error(response.message || 'Failed to update application status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      throw err;
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
