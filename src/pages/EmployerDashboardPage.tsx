import React, { useState, useMemo } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { DashboardStats } from '../components/employer/DashboardStats';
import { JobPostingForm } from '../components/employer/JobPostingForm';
import { JobManagementCard } from '../components/employer/JobManagementCard';
import { ApplicationCard } from '../components/employer/ApplicationCard';
import TeamManagement from '../components/team/TeamManagement';
import { Button, Input, Select, Card } from '../components/ui';
import { mockJobs } from '../data/jobs';
import { mockJobApplications, mockCandidates } from '../data/employers';
import type { Job, JobApplication, Organization } from '../types';

export const EmployerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'team'>('overview');
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicationFilters, setApplicationFilters] = useState({
    status: '',
    search: '',
  });

  // Mock data - in real app, this would come from API
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockJobApplications);

  // Mock organization data for team management
  const mockOrganization: Organization = {
    id: 'org-1',
    name: 'Acme Corporation',
    subscriptionPlan: 'enterprise',
    maxRecruiters: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    ownerId: 'user-1',
    settings: {
      allowMultipleRecruiters: true,
      requireApprovalForNewMembers: false,
    }
  };

  const stats = useMemo(() => {
    const activeJobs = jobs.filter(job => job.isActive).length;
    const totalApplications = applications.length;
    const profileViews = 1250; // Mock data
    const hiredCandidates = applications.filter(app => app.status === 'hired').length;

    return {
      activeJobs,
      totalApplications,
      profileViews,
      hiredCandidates,
    };
  }, [jobs, applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const candidate = mockCandidates.find(c => c.id === app.candidateId);
      if (!candidate) return false;

      if (applicationFilters.status && app.status !== applicationFilters.status) {
        return false;
      }

      if (applicationFilters.search) {
        const searchTerm = applicationFilters.search.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(searchTerm);
        const matchesEmail = candidate.email.toLowerCase().includes(searchTerm);
        const matchesSkills = candidate.skills.some(skill =>
          skill.toLowerCase().includes(searchTerm)
        );
        if (!matchesName && !matchesEmail && !matchesSkills) {
          return false;
        }
      }

      if (selectedJobId && app.jobId !== selectedJobId) {
        return false;
      }

      return true;
    });
  }, [applications, applicationFilters, selectedJobId]);

  const handleJobSubmit = (jobData: any) => {
    console.log('New job posted:', jobData);
    // In real app, this would make an API call
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      company: {
        id: 'comp-employer',
        name: 'TechCorp Solutions', // Would come from employer profile
        logoUrl: 'https://via.placeholder.com/64x64?text=TC',
        size: '100-500',
        industry: 'Technology'
      },
      location: jobData.location,
      type: jobData.type || 'full-time',
      jobType: jobData.type || 'full-time',
      experience: jobData.experience || '0-5 years',
      experienceMin: parseInt(jobData.experience?.split('-')[0]) || 0,
      experienceMax: parseInt(jobData.experience?.split('-')[1]) || undefined,
      experienceLevel: 'mid', // Would be determined from experience range
      salary: {
        min: jobData.salaryMin || 0,
        max: jobData.salaryMax || 0,
        currency: 'INR',
      },
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      currency: 'INR',
      skills: jobData.skills || [],
      description: jobData.description || '',
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      isActive: true,
      applicationsCount: 0,
      employerId: 'emp1',
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleJobEdit = (jobId: string) => {
    console.log('Edit job:', jobId);
    // Implement edit job functionality
  };

  const handleJobDelete = (jobId: string) => {
    console.log('Delete job:', jobId);
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleJobToggleStatus = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, isActive: !job.isActive } : job
    ));
  };

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('applications');
  };

  const handleStatusChange = (applicationId: string, status: JobApplication['status']) => {
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status } : app
    ));
  };

  const handleViewProfile = (candidateId: string) => {
    console.log('View candidate profile:', candidateId);
    // Navigate to candidate profile
  };

  const handleDownloadResume = (resumeUrl: string) => {
    console.log('Download resume:', resumeUrl);
    // Implement resume download
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const jobOptions = [
    { value: '', label: 'All Jobs' },
    ...jobs.map(job => ({ value: job.id, label: job.title })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
          </div>
          <Button onClick={() => setIsJobFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'jobs', label: 'Jobs' },
              { id: 'applications', label: 'Applications' },
              { id: 'team', label: 'Team' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.applicationsCount} applications</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplications(job.id)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => {
                    const candidate = mockCandidates.find(c => c.id === app.candidateId);
                    if (!candidate) return null;

                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{app.status}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(candidate.id)}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobManagementCard
                  key={job.id}
                  job={job}
                  applicationsCount={applications.filter(app => app.jobId === job.id).length}
                  onEdit={handleJobEdit}
                  onDelete={handleJobDelete}
                  onViewApplications={handleViewApplications}
                  onToggleStatus={handleJobToggleStatus}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search candidates..."
                  leftIcon={<Search className="w-4 h-4" />}
                  value={applicationFilters.search}
                  onChange={(e) => setApplicationFilters(prev => ({ ...prev, search: e.target.value }))}
                />

                <Select
                  options={statusOptions}
                  value={applicationFilters.status}
                  onChange={(e) => setApplicationFilters(prev => ({ ...prev, status: e.target.value }))}
                  placeholder="Filter by status"
                />

                <Select
                  options={jobOptions}
                  value={selectedJobId || ''}
                  onChange={(e) => setSelectedJobId(e.target.value || null)}
                  placeholder="Filter by job"
                />
              </div>
            </Card>

            {/* Applications */}
            <div className="space-y-6">
              {filteredApplications.map((application) => {
                const candidate = mockCandidates.find(c => c.id === application.candidateId);
                if (!candidate) return null;

                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    candidate={candidate}
                    onStatusChange={handleStatusChange}
                    onViewProfile={handleViewProfile}
                    onDownloadResume={handleDownloadResume}
                  />
                );
              })}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or check back later for new applications.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <TeamManagement
              organization={mockOrganization}
              onUpdateOrganization={() => {}}
            />
          </div>
        )}

        {/* Job Posting Form Modal */}
        <JobPostingForm
          isOpen={isJobFormOpen}
          onClose={() => setIsJobFormOpen(false)}
          onSubmit={handleJobSubmit}
        />
      </div>
    </div>
  );
};
