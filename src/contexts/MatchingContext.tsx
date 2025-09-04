import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobMatchingService } from '../services/jobMatchingService';
import { profileValidationService, getProfileCompletionStatus } from '../services/profileValidationService';
import type { JobMatch, CandidateMatch, MatchingStats, CandidateProfile } from '../types';
import { enhancedMockJobs } from '../data/enhancedJobs';
import { mockCandidateProfile } from '../data/candidates';

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

  // Mock candidate profile - in real app, this would come from user context
  const candidateProfile: CandidateProfile = {
    ...mockCandidateProfile,
    preferences: {
      ...mockCandidateProfile.preferences,
      remoteWork: true,
      hybridWork: true,
    },
    profileCompletionPercentage: 85,
    matchingEnabled: true,
  };

  const refreshProfileStatus = () => {
    const status = getProfileCompletionStatus(candidateProfile);
    setProfileStatus(status);
  };

  const canViewRecommendations = () => {
    return profileValidationService.meetsMinimumRequirements(candidateProfile);
  };

  const fetchRecommendedJobs = async (minThreshold = 70, page = 0, size = 20) => {
    if (user?.role !== 'candidate') return;

    setLoadingJobs(true);
    try {
      // Use the job matching service with strict filtering
      const matches = await jobMatchingService.findMatchingJobs(
        candidateProfile,
        enhancedMockJobs
      );

      // Filter by minimum threshold
      const filteredMatches = matches.filter(
        match => match.matchPercentage >= minThreshold
      );

      // Apply pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

      if (page === 0) {
        setRecommendedJobs(paginatedMatches);
      } else {
        setRecommendedJobs(prev => [...prev, ...paginatedMatches]);
      }

      // Update matching stats
      setMatchingStats({
        totalJobs: enhancedMockJobs.length,
        matchedJobs: filteredMatches.length,
        totalMatches: filteredMatches.length,
        averageMatchPercentage: filteredMatches.reduce((sum, match) => sum + match.matchPercentage, 0) / filteredMatches.length || 0,
        topSkillsInDemand: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        topSkills: candidateProfile.skills.map(s => s.name).slice(0, 5),
        matchingEnabled: candidateProfile.matchingEnabled,
        lastUpdated: new Date().toISOString(),
        profileCompleteness: candidateProfile.profileCompletionPercentage,
        recommendationsCount: filteredMatches.length,
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

  const fetchTopMatches = async (limit = 10) => {
    if (user?.role !== 'candidate') return;

    try {
      // Use the job matching service to get top matches
      const matches = await jobMatchingService.findMatchingJobs(
        candidateProfile,
        enhancedMockJobs
      );

      // Get top matches (highest percentages)
      const topMatches = matches
        .filter(match => match.matchPercentage >= 80) // Only high-quality matches for "top"
        .slice(0, limit);

      setTopMatches(topMatches);
    } catch (error) {
      console.error('Error fetching top matches:', error);
    }
  };

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
  }, [user]);

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
