import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobMatchingService } from '../services/jobMatchingService';
import { profileValidationService, getProfileCompletionStatus } from '../services/profileValidationService';
import type { JobMatch, CandidateMatch, MatchingStats, CandidateProfile } from '../types';
import { jobsAPI, candidatesAPI } from '../services/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = (token?: string | null) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});


interface MatchingContextType {
  // Candidate features
  recommendedJobs: JobMatch[];
  topMatches: JobMatch[];
  matchingStats: MatchingStats | null;
  loadingJobs: boolean;
  profileStatus: any; // Profile completion status

  // Recruiter features
  matchingCandidates: CandidateMatch[];
  jobApplicants: CandidateMatch[];
  loadingCandidates: boolean;

  // Actions
  fetchRecommendedJobs: (minThreshold?: number, page?: number, size?: number) => Promise<void>;
  fetchTopMatches: (limit?: number) => Promise<void>;
  fetchMatchingCandidates: (jobId: string, page?: number, size?: number) => Promise<void>;
  fetchJobApplicants: (jobId: string, page?: number, size?: number) => Promise<void>;
  getJobMatch: (jobId: string) => Promise<JobMatch | null>;
  enableMatching: () => Promise<void>;
  disableMatching: () => Promise<void>;
  refreshProfileStatus: () => void;
  canViewRecommendations: () => boolean;
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined);

export const useMatching = () => {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error('useMatching must be used within a MatchingProvider');
  }
  return context;
};

export const MatchingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<JobMatch[]>([]);
  const [topMatches, setTopMatches] = useState<JobMatch[]>([]);
  const [matchingCandidates, setMatchingCandidates] = useState<CandidateMatch[]>([]);
  const [jobApplicants, setJobApplicants] = useState<CandidateMatch[]>([]);
  const [matchingStats, setMatchingStats] = useState<MatchingStats | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [profileStatus, setProfileStatus] = useState<any>(null);

  // Stub candidate profile - will be replaced with real user profile data
  const candidateProfile: CandidateProfile = {
    id: user?.id || 'temp-id',
    userId: user?.id || 'temp-id',
    firstName: user?.firstName || 'User',
    lastName: user?.lastName || '',
    headline: '',
    summary: '',
    location: '',
    experience: [],
    education: [],
    skills: [],
    preferences: {
      jobTypes: [],
      locations: [],
      salaryExpectation: { min: 0, max: 0, currency: 'INR' },
      remoteWork: true,
      hybridWork: true,
    },
    isPublic: false,
    profileViews: 0,
    profileCompletionPercentage: 50,
    matchingEnabled: false,
  };

  const refreshProfileStatus = useCallback(() => {
    const status = getProfileCompletionStatus(candidateProfile);
    setProfileStatus(status);
  }, [candidateProfile]);

  const canViewRecommendations = () => {
    return profileValidationService.meetsMinimumRequirements(candidateProfile);
  };

  const fetchRecommendedJobs = async (minThreshold = 70, page = 0, size = 20) => {
    if (user?.role !== 'candidate') return;

    setLoadingJobs(true);
    try {
      // Stub implementation - will be replaced with real API calls
      setRecommendedJobs([]);
      setMatchingStats({
        totalJobs: 0,
        matchedJobs: 0,
        totalMatches: 0,
        averageMatchPercentage: 0,
        topSkillsInDemand: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        topSkills: [],
        matchingEnabled: false,
        lastUpdated: new Date().toISOString(),
        profileCompleteness: candidateProfile.profileCompletionPercentage,
        recommendationsCount: 0,
        strictFiltersApplied: {
          salaryFilter: true,
          experienceFilter: true,
        },
      });
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      setRecommendedJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchTopMatches = useCallback(async (limit = 10) => {
    if (user?.role !== 'candidate') return;

    try {
      // Stub implementation - will be replaced with real API calls
      setTopMatches([]);
    } catch (error) {
      console.error('Error fetching top matches:', error);
    }
  }, [user?.role]);

  const fetchMatchingCandidates = async (_jobId: string, _page = 0, _size = 20) => {
    if (user?.role !== 'employer') return;

    setLoadingCandidates(true);
    try {
      // Mock implementation - in real app, this would use a candidate matching service
      setMatchingCandidates([]);
    } catch (error) {
      console.error('Error fetching matching candidates:', error);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const fetchJobApplicants = async (_jobId: string, _page = 0, _size = 20) => {
    if (user?.role !== 'employer') return;

    setLoadingCandidates(true);
    try {
      // Mock implementation - in real app, this would fetch actual applicants
      setJobApplicants([]);
    } catch (error) {
      console.error('Error fetching job applicants:', error);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const getJobMatch = async (jobId: string): Promise<JobMatch | null> => {
    if (!token || user?.role !== 'candidate') return null;

    try {
      const response = await fetch(
        `${API_BASE_URL}/candidates/job-match/${jobId}`,
        { headers: getAuthHeaders(token) }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching job match:', error);
    }
    return null;
  };

  const enableMatching = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/enable-matching`,
        {
          method: 'POST',
          headers: getAuthHeaders(token)
        }
      );

      if (response.ok) {
        setMatchingStats((prev: MatchingStats | null) => prev ? { ...prev, matchingEnabled: true } : null);
      }
    } catch (error) {
      console.error('Error enabling matching:', error);
    }
  };

  const disableMatching = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/disable-matching`,
        {
          method: 'POST',
          headers: getAuthHeaders(token)
        }
      );

      if (response.ok) {
        setMatchingStats((prev: MatchingStats | null) => prev ? { ...prev, matchingEnabled: false } : null);
      }
    } catch (error) {
      console.error('Error disabling matching:', error);
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchTopMatches();
      refreshProfileStatus();
    }
  }, [user, fetchTopMatches, refreshProfileStatus]);

  const value: MatchingContextType = {
    recommendedJobs,
    topMatches,
    matchingCandidates,
    jobApplicants,
    matchingStats,
    profileStatus,
    loadingJobs,
    loadingCandidates,
    fetchRecommendedJobs,
    fetchTopMatches,
    fetchMatchingCandidates,
    fetchJobApplicants,
    getJobMatch,
    enableMatching,
    disableMatching,
    refreshProfileStatus,
    canViewRecommendations,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
