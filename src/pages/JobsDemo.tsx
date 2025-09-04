import React, { useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import JobModal from '../components/jobs/JobModal';
import type { Job } from '../types';

// Demo data matching your image examples
const demoJobs: Job[] = [
  {
    id: '1',
    title: 'Member of Technical Staff - C#',
    company: {
      id: '1',
      name: 'Omnissa',
      logoUrl: '',
      size: 'LARGE',
      industry: 'Technology'
    },
    location: 'Bangalore',
    type: 'full-time',
    jobType: 'full-time',
    experience: '5-7 years',
    experienceMin: 5,
    experienceMax: 7,
    salary: {
      min: 1500000,
      max: 2500000,
      currency: 'INR'
    },
    salaryMin: 1500000,
    salaryMax: 2500000,
    skills: ['.NET', 'ASP.NET', 'C#'],
    description: 'Omnissa is an AI-driven digital work platform that combines endpoint management, virtual apps, employee experience, and security through...',
    requirements: [
      'Strong experience in C# and .NET framework',
      'Experience with ASP.NET and web development',
      'Knowledge of database systems and SQL',
      'Understanding of software development lifecycle'
    ],
    benefits: [
      'Competitive salary and benefits',
      'Health insurance coverage',
      'Flexible working hours',
      'Professional development opportunities'
    ],
    postedAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z',
    isActive: true,
    applicationsCount: 45,
    employerId: 'emp1'
  },
  {
    id: '2',
    title: 'Senior Software Engineer',
    company: {
      id: '2',
      name: 'Zynga',
      logoUrl: '',
      size: 'LARGE',
      industry: 'Gaming'
    },
    location: 'Bangalore',
    type: 'full-time',
    jobType: 'full-time',
    experience: '4-8 years',
    experienceMin: 4,
    experienceMax: 8,
    salary: {
      min: 1800000,
      max: 3000000,
      currency: 'INR'
    },
    salaryMin: 1800000,
    salaryMax: 3000000,
    skills: ['C++', 'Java', '.NET', 'Android', 'iOS', 'JavaScript', 'PHP'],
    description: 'Zynga makes social video games. It is the creator of highly popular games such as Farmville and Zynga Poker. HQ in San Francisco.',
    requirements: [
      'Strong programming skills in multiple languages',
      'Experience with game development',
      'Knowledge of mobile platforms',
      'Team collaboration skills'
    ],
    benefits: [
      'Stock options',
      'Game development experience',
      'International exposure',
      'Creative work environment'
    ],
    postedAt: '2024-01-14T08:00:00Z',
    expiresAt: '2024-02-14T08:00:00Z',
    isActive: true,
    applicationsCount: 78,
    employerId: 'emp2'
  },
  {
    id: '3',
    title: 'SDE - 2',
    company: {
      id: '3',
      name: 'ShareChat',
      logoUrl: '',
      size: 'MEDIUM',
      industry: 'Social Media'
    },
    location: 'Bangalore',
    type: 'full-time',
    jobType: 'full-time',
    experience: '2-5 years',
    experienceMin: 2,
    experienceMax: 5,
    salary: {
      min: 1200000,
      max: 2000000,
      currency: 'INR'
    },
    salaryMin: 1200000,
    salaryMax: 2000000,
    skills: ['C', 'C++', 'Golang', 'Java', 'NodeJS', 'Python'],
    description: 'ShareChat is a social networking and regional content platform for India. It enables users to share content in their own language, follow...',
    requirements: [
      'Strong programming fundamentals',
      'Experience with backend technologies',
      'Understanding of scalable systems',
      'Problem-solving skills'
    ],
    benefits: [
      'Fast-paced startup environment',
      'Learning opportunities',
      'Equity participation',
      'Flexible policies'
    ],
    postedAt: '2024-01-13T12:00:00Z',
    expiresAt: '2024-02-13T12:00:00Z',
    isActive: true,
    applicationsCount: 92,
    employerId: 'emp3'
  },
  {
    id: '4',
    title: 'Software Engineer',
    company: {
      id: '4',
      name: 'PhonePe',
      logoUrl: '',
      size: 'LARGE',
      industry: 'Fintech'
    },
    location: 'Bangalore',
    type: 'full-time',
    jobType: 'full-time',
    experience: '1-3 years',
    experienceMin: 1,
    experienceMax: 3,
    salary: {
      min: 1000000,
      max: 1800000,
      currency: 'INR'
    },
    salaryMin: 1000000,
    salaryMax: 1800000,
    skills: ['C', 'C++', 'Golang', 'Java'],
    description: 'PhonePe is a digital UPI enabled mobile payment app company which has built a platform for easy, safe and universal transfer of cash...',
    requirements: [
      'Strong coding skills',
      'Experience with payment systems',
      'Understanding of security principles',
      'Agile development experience'
    ],
    benefits: [
      'Fintech industry experience',
      'Comprehensive health benefits',
      'Performance bonuses',
      'Career growth opportunities'
    ],
    postedAt: '2024-01-12T14:00:00Z',
    expiresAt: '2024-02-12T14:00:00Z',
    isActive: true,
    applicationsCount: 156,
    employerId: 'emp4'
  }
];

const JobsDemo: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Showing 1 - 30 out of 117 jobs
            </h1>
            <p className="text-gray-600">that are recommended for you</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <span className="ml-2 text-sm text-gray-700">Undecided (117)</span>
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
                      <span className="ml-2 text-sm text-gray-700">All (117)</span>
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
            <div className="space-y-4">
              {demoJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
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

export default JobsDemo;
