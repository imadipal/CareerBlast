import axios from 'axios';
import type { Job, JobFilters, CandidateProfile, EmployerProfile, JobApplication, User } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors - SECURE LOGGING
    if (!error.response && error.code === 'ERR_NETWORK') {
      // Only log detailed errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Network Error:', error.message);
      }

      return Promise.reject({
        ...error,
        message: 'Unable to connect to server. Please check if the backend is running.',
        isCorsError: true
      });
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'USER' | 'EMPLOYER';
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Jobs API
export const jobsAPI = {
  getJobs: async (filters?: JobFilters, page = 1, limit = 12) => {
    const params = new URLSearchParams();
    if (filters?.location) params.append('location', filters.location);
    if (filters?.experience) params.append('experience', filters.experience);
    if (filters?.type) filters.type.forEach(type => params.append('type', type));
    if (filters?.skills) filters.skills.forEach(skill => params.append('skills', skill));
    if (filters?.company) params.append('search', filters.company);
    if (filters?.salary?.min) params.append('salaryMin', filters.salary.min.toString());
    if (filters?.salary?.max) params.append('salaryMax', filters.salary.max.toString());
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData: Partial<Job>) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  applyToJob: async (jobId: string, applicationData: {
    coverLetter?: string;
    resumeUrl?: string;
  }) => {
    const response = await api.post('/applications', { jobId, ...applicationData });
    return response.data;
  },
};

// Candidates API
export const candidatesAPI = {
  getProfile: async (id?: string) => {
    const url = id ? `/candidates/${id}` : '/candidates/me';
    const response = await api.get(url);
    return response.data;
  },

  updateProfile: async (profileData: Partial<CandidateProfile>) => {
    const response = await api.put('/candidates/me', profileData);
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/candidates/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await api.get('/candidates/saved-jobs');
    return response.data;
  },

  saveJob: async (jobId: string) => {
    const response = await api.post(`/candidates/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId: string) => {
    const response = await api.delete(`/candidates/saved-jobs/${jobId}`);
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get('/candidates/applications');
    return response.data;
  },
};

// Employers API
export const employersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (profileData: Partial<EmployerProfile>) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  getJobs: async () => {
    // Get jobs created by current employer
    const response = await api.get('/jobs/search?employer=me');
    return response.data;
  },

  getApplications: async (jobId?: string) => {
    const url = jobId ? `/applications?jobId=${jobId}` : '/applications';
    const response = await api.get(url);
    return response.data;
  },

  updateApplicationStatus: async (applicationId: string, status: JobApplication['status']) => {
    const response = await api.put(`/applications/${applicationId}`, { status });
    return response.data;
  },

  getDashboardStats: async () => {
    // Calculate stats from jobs and applications
    const [jobsResponse, applicationsResponse] = await Promise.all([
      api.get('/jobs/search?employer=me'),
      api.get('/applications')
    ]);

    const jobs = jobsResponse.data?.data || [];
    const applications = applicationsResponse.data?.data || [];

    return {
      success: true,
      data: {
        activeJobs: jobs.filter((job: any) => job.isActive).length,
        totalApplications: applications.length,
        profileViews: 0, // Not available from backend yet
        hiredCandidates: applications.filter((app: any) => app.status === 'hired').length,
      }
    };
  },
};

// Users API
export const usersAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateUser: async (userData: Partial<User>) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },
};

// File upload utility
export const uploadFile = async (file: File, type: 'resume' | 'avatar' | 'company-logo') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export default api;
export { api };
