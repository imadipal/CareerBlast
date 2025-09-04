import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Filter, Search, Sparkles } from 'lucide-react';
import { useMatching } from '../contexts/MatchingContext';
import { useAuth } from '../hooks/useAuth';
import { JobMatchCard } from '../components/jobs/JobMatchCard';
import { ResumeRequiredGuard } from '../components/profile/ResumeRequiredGuard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const RecommendedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    recommendedJobs, 
    topMatches, 
    loadingJobs, 
    fetchRecommendedJobs, 
    fetchTopMatches 
  } = useMatching();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchRecommendedJobs(70, currentPage);
      fetchTopMatches(5);
    }
  }, [user?.role, currentPage, fetchRecommendedJobs, fetchTopMatches]);

  const handleJobApply = (jobId: string) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const filteredJobs = recommendedJobs.filter(jobMatch =>
    jobMatch.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobMatch.job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.matchPercentage - a.matchPercentage;
      case 'salary':
        return (b.job.salaryMax || 0) - (a.job.salaryMax || 0);
      case 'date':
        return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
      default:
        return 0;
    }
  });

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

  return (
    <ResumeRequiredGuard
      message="Upload your resume to access personalized job recommendations"
      redirectTo="/resume"
    >
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
                Recommended Jobs
              </h1>
              <p className="text-gray-600">
                Jobs that match your profile with 70%+ compatibility
              </p>
            </div>
          </div>

          {/* Top matches preview */}
          {topMatches.length > 0 && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Top Matches</h2>
                </div>
                <span className="text-sm text-gray-600">
                  {topMatches.length} excellent matches found
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topMatches.slice(0, 3).map((jobMatch) => (
                  <div key={jobMatch.job.id} className="bg-white rounded-xl p-4 shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {jobMatch.job.title}
                      </h3>
                      <span className="text-sm font-bold text-brand-600">
                        {Math.round(jobMatch.matchPercentage)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{jobMatch.job.company.name}</p>
                    <Button
                      size="sm"
                      onClick={() => handleJobDetails(jobMatch.job.id)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="match">Best Match</option>
                  <option value="salary">Highest Salary</option>
                  <option value="date">Most Recent</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Job Results */}
        {loadingJobs ? (
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
        ) : sortedJobs.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {sortedJobs.length} matching jobs
              </p>
              <div className="text-sm text-gray-500">
                Sorted by {sortBy === 'match' ? 'Best Match' : sortBy === 'salary' ? 'Highest Salary' : 'Most Recent'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedJobs.map((jobMatch) => (
                <JobMatchCard
                  key={jobMatch.job.id}
                  job={jobMatch.job}
                  matchPercentage={jobMatch.matchPercentage}
                  matchExplanation={jobMatch.matchExplanation}
                  salaryMatches={jobMatch.salaryMatches}
                  experienceMatches={jobMatch.experienceMatches}
                  onViewDetails={() => handleJobDetails(jobMatch.job.id)}
                  onApply={() => handleJobApply(jobMatch.job.id)}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  fetchRecommendedJobs(currentPage + 1);
                }}
                disabled={loadingJobs}
              >
                Load More Jobs
              </Button>
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
                ? "Try adjusting your search terms or filters"
                : "Complete your profile to get personalized job recommendations"
              }
            </p>
            <Button onClick={() => navigate('/profile')}>
              Complete Profile
            </Button>
          </Card>
        )}
        </div>
      </div>
    </ResumeRequiredGuard>
  );
};
