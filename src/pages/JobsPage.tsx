import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobModal from '../components/jobs/JobModal';
import { Button, Pagination } from '../components/ui';
import { useMatching } from '../contexts/MatchingContext';
import type { Job } from '../types';

export const JobsPage: React.FC = () => {
  const {
    recommendedJobs,
    matchingStats,
    loadingJobs,
    fetchRecommendedJobs
  } = useMatching();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jobsPerPage = 20; // 20 jobs per page as requested

  // Calculate pagination info
  const totalJobs = matchingStats?.matchedJobs || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage + 1;
  const endIndex = Math.min(currentPage * jobsPerPage, totalJobs);

  // Load jobs when page changes or component mounts
  useEffect(() => {
    fetchRecommendedJobs(70, currentPage - 1, jobsPerPage);
  }, [currentPage, fetchRecommendedJobs]);

  // Initial load
  useEffect(() => {
    if (recommendedJobs.length === 0) {
      fetchRecommendedJobs(70, 0, jobsPerPage);
    }
  }, [fetchRecommendedJobs, recommendedJobs.length]);

  // Convert JobMatch[] to Job[] for the JobCard component
  const jobs: Job[] = recommendedJobs.map(jobMatch => jobMatch.job);



  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Showing {startIndex} - {endIndex} out of {totalJobs} jobs
            </h1>
            <p className="text-gray-600">that are recommended for you</p>
          </div>
        </div>



        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick tip</h3>
              <p className="text-sm text-gray-600 mb-4">
                Since not all companies will go ahead, we encourage you to apply to several companies.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                However, avoid applying if you don't want to interview as any interview shortcuts will be shown to other companies!
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Filter by status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="status" className="text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Undecided ({totalJobs})</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="status" className="text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Interested (942)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="status" className="text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Not interested (4)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Filter by location</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">All ({totalJobs})</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Bangalore (77)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Gurgaon (17)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {loadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading recommended jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="space-y-4 mb-8">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any jobs matching your profile at the moment. Please check back later.
                </p>
                <Button onClick={() => fetchRecommendedJobs(70, 0, jobsPerPage)}>Refresh Jobs</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Modal */}
      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
