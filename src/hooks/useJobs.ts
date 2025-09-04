import { useState, useEffect, useCallback } from 'react';
import type { Job, JobFilters } from '../types';
// import { jobsAPI } from '../services/api';
import { mockJobs } from '../data/jobs';

interface UseJobsOptions {
  filters?: JobFilters;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalJobs: number;
  refetch: () => void;
  applyToJob: (jobId: string, applicationData: { coverLetter?: string }) => Promise<void>;
}

export const useJobs = (options: UseJobsOptions = {}): UseJobsReturn => {
  const { filters, page = 1, limit = 12, enabled = true } = options;
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      // In production, uncomment the API call below
      // const response = await jobsAPI.getJobs(filters, page, limit);
      
      // Mock implementation
      let filteredJobs = [...mockJobs];
      
      // Apply filters
      if (filters?.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters?.experience) {
        // Convert experience filter to match job experience range
        const expMatch = filters.experience.match(/(\d+)-(\d+)/);
        if (expMatch) {
          const filterMin = parseInt(expMatch[1]);
          const filterMax = parseInt(expMatch[2]);
          filteredJobs = filteredJobs.filter(job => {
            if (job.experienceMin && job.experienceMax) {
              return !(job.experienceMax < filterMin || job.experienceMin > filterMax);
            }
            return true;
          });
        }
      }

      if (filters?.type && filters.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => filters.type!.includes(job.jobType));
      }
      
      if (filters?.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          filters.skills!.some(skill =>
            job.skills.some(jobSkill =>
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      
      if (filters?.company) {
        const searchTerm = filters.company.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.company.name.toLowerCase().includes(searchTerm) ||
          job.title.toLowerCase().includes(searchTerm) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      if (filters?.salary) {
        const { min, max } = filters.salary;
        filteredJobs = filteredJobs.filter(job => {
          if (min && job.salaryMax && job.salaryMax < min) return false;
          if (max && job.salaryMin && job.salaryMin > max) return false;
          return true;
        });
      }

      const total = filteredJobs.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

      setJobs(paginatedJobs);
      setTotalJobs(total);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit, enabled]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const applyToJob = async (jobId: string, applicationData: { coverLetter?: string }) => {
    try {
      // SECURITY: Remove sensitive logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Applying to job:', jobId);
      }

      // In production, uncomment the API call below
      // await jobsAPI.applyToJob(jobId, applicationData);

      // Prevent unused parameter warning
      void applicationData;

      // Show success message or update UI
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to apply to job');
    }
  };

  return {
    jobs,
    loading,
    error,
    totalPages,
    totalJobs,
    refetch: fetchJobs,
    applyToJob,
  };
};

// Hook for getting a single job
export const useJob = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);

      try {
        // For demo purposes, find job in mock data
        const foundJob = mockJobs.find(j => j.id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          setError('Job not found');
        }
        
        // In production, use API call:
        // const response = await jobsAPI.getJobById(jobId);
        // setJob(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
};

// Hook for saved jobs
export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [_loading, _setLoading] = useState(false);

  const toggleSaveJob = useCallback(async (jobId: string) => {
    const isSaved = savedJobs.has(jobId);
    
    try {
      if (isSaved) {
        // await candidatesAPI.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        // await candidatesAPI.saveJob(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Failed to toggle save job:', err);
    }
  }, [savedJobs]);

  const isSaved = useCallback((jobId: string) => savedJobs.has(jobId), [savedJobs]);

  return {
    savedJobs: Array.from(savedJobs),
    loading: _loading,
    toggleSaveJob,
    isSaved,
  };
};
