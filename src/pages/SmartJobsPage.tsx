import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Filter, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  Settings,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { JobMatchCard } from '../components/jobs/JobMatchCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { jobMatchingService } from '../services/jobMatchingService';
import { profileValidationService, getProfileCompletionStatus } from '../services/profileValidationService';
import type { JobMatch, CandidateProfile, Job } from '../types';
import { enhancedMockJobs } from '../data/enhancedJobs';
import { mockCandidateProfile } from '../data/candidates';

export const SmartJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'date'>('match');
  const [minMatchThreshold, setMinMatchThreshold] = useState(70);
  const [profileStatus, setProfileStatus] = useState<any>(null);

  // Mock candidate profile - in real app, this would come from user context
  const candidateProfile: CandidateProfile = {
    ...mockCandidateProfile,
    totalExperienceYears: 5,
    currentExperienceLevel: 'mid',
    preferences: {
      ...mockCandidateProfile.preferences,
      remoteWork: true,
      hybridWork: true,
    },
    profileCompletionPercentage: 85,
    hasRequiredMatchingData: true,
    matchingEnabled: true,
    minimumMatchThreshold: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    if (user?.role === 'candidate') {
      loadJobMatches();
      checkProfileStatus();
    }
  }, [user, minMatchThreshold]);

  const loadJobMatches = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from API
      const matches = await jobMatchingService.findMatchingJobs(
        candidateProfile,
        enhancedMockJobs
      );
      
      // Filter by minimum threshold
      const filteredMatches = matches.filter(
        match => match.matchPercentage >= minMatchThreshold
      );
      
      setJobMatches(filteredMatches);
    } catch (error) {
      console.error('Error loading job matches:', error);
      setJobMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileStatus = () => {
    const status = getProfileCompletionStatus(candidateProfile);
    setProfileStatus(status);
  };

  const filteredAndSortedMatches = useMemo(() => {
    let filtered = jobMatches;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort matches
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchPercentage - a.matchPercentage;
        case 'salary':
          const aSalary = a.job.salaryMax || a.job.salaryMin || 0;
          const bSalary = b.job.salaryMax || b.job.salaryMin || 0;
          return bSalary - aSalary;
        case 'date':
          return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
        default:
          return 0;
      }
    });
  }, [jobMatches, searchTerm, sortBy]);

  const handleJobApply = (jobId: string) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleRefreshMatches = () => {
    loadJobMatches();
  };

  // Redirect non-candidates
  if (user?.role !== 'candidate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only available for job seekers.</p>
        </Card>
      </div>
    );
  }

  // Show profile completion prompt if profile is incomplete
  if (profileStatus && !profileStatus.canViewRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              To see personalized job recommendations with 70%+ match scores, please complete your profile with salary expectations and experience details.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-brand-600">{profileStatus.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-brand-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${profileStatus.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {profileStatus.nextAction && (
              <div className="text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Next Step:</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900">{profileStatus.nextAction.title}</h4>
                  <p className="text-sm text-blue-700">{profileStatus.nextAction.description}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/profile')}>
                Complete Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/jobs')}>
                Browse All Jobs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Smart Job Recommendations
              </h1>
              <p className="text-gray-600">
                Personalized matches with {minMatchThreshold}%+ compatibility • Strict salary & experience filtering applied
              </p>
            </div>
          </div>

          {/* Profile completion status */}
          {profileStatus && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Profile Ready for Matching</h3>
                    <p className="text-sm text-gray-600">
                      {profileStatus.completionPercentage}% complete • Salary & experience data verified
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Optimize</span>
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="match">Best Match</option>
                  <option value="salary">Highest Salary</option>
                  <option value="date">Most Recent</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <select
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={70}>70%+ Match</option>
                  <option value={80}>80%+ Match</option>
                  <option value={90}>90%+ Match</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshMatches}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedMatches.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredAndSortedMatches.length} high-quality matches
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <div className="text-sm text-gray-500">
                Sorted by {sortBy === 'match' ? 'Best Match' : sortBy === 'salary' ? 'Highest Salary' : 'Most Recent'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedMatches.map((jobMatch) => (
                <JobMatchCard
                  key={jobMatch.id}
                  jobMatch={jobMatch}
                  onViewDetails={() => handleJobDetails(jobMatch.job.id)}
                  onApply={() => handleJobApply(jobMatch.job.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No jobs match your search for "${searchTerm}" with ${minMatchThreshold}%+ compatibility`
                : `No jobs currently meet your ${minMatchThreshold}%+ match criteria`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setMinMatchThreshold(70)}>
                Lower Match Threshold
              </Button>
              <Button variant="outline" onClick={() => navigate('/jobs')}>
                Browse All Jobs
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
