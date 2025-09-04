import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Job, JobApplication, CandidateProfile, EmployerProfile } from '../types';

// State interface
interface DataState {
  jobs: Job[];
  applications: JobApplication[];
  candidateProfile: CandidateProfile | null;
  employerProfile: EmployerProfile | null;
  savedJobs: string[];
  loading: {
    jobs: boolean;
    applications: boolean;
    profile: boolean;
  };
  error: {
    jobs: string | null;
    applications: string | null;
    profile: string | null;
  };
}

// Action types
type DataAction =
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: { id: string; data: Partial<Job> } }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_APPLICATIONS'; payload: JobApplication[] }
  | { type: 'UPDATE_APPLICATION'; payload: { id: string; data: Partial<JobApplication> } }
  | { type: 'SET_CANDIDATE_PROFILE'; payload: CandidateProfile }
  | { type: 'SET_EMPLOYER_PROFILE'; payload: EmployerProfile }
  | { type: 'ADD_SAVED_JOB'; payload: string }
  | { type: 'REMOVE_SAVED_JOB'; payload: string }
  | { type: 'SET_LOADING'; payload: { key: keyof DataState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof DataState['error']; value: string | null } }
  | { type: 'CLEAR_ERROR'; payload: keyof DataState['error'] };

// Initial state
const initialState: DataState = {
  jobs: [],
  applications: [],
  candidateProfile: null,
  employerProfile: null,
  savedJobs: [],
  loading: {
    jobs: false,
    applications: false,
    profile: false,
  },
  error: {
    jobs: null,
    applications: null,
    profile: null,
  },
};

// Reducer
const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload,
      };

    case 'ADD_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
      };

    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.data }
            : job
        ),
      };

    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };

    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
      };

    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id
            ? { ...app, ...action.payload.data }
            : app
        ),
      };

    case 'SET_CANDIDATE_PROFILE':
      return {
        ...state,
        candidateProfile: action.payload,
      };

    case 'SET_EMPLOYER_PROFILE':
      return {
        ...state,
        employerProfile: action.payload,
      };

    case 'ADD_SAVED_JOB':
      return {
        ...state,
        savedJobs: [...state.savedJobs, action.payload],
      };

    case 'REMOVE_SAVED_JOB':
      return {
        ...state,
        savedJobs: state.savedJobs.filter(id => id !== action.payload),
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload]: null,
        },
      };

    default:
      return state;
  }
};

// Context
interface DataContextType {
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
  actions: {
    setJobs: (jobs: Job[]) => void;
    addJob: (job: Job) => void;
    updateJob: (id: string, data: Partial<Job>) => void;
    deleteJob: (id: string) => void;
    setApplications: (applications: JobApplication[]) => void;
    updateApplication: (id: string, data: Partial<JobApplication>) => void;
    setCandidateProfile: (profile: CandidateProfile) => void;
    setEmployerProfile: (profile: EmployerProfile) => void;
    addSavedJob: (jobId: string) => void;
    removeSavedJob: (jobId: string) => void;
    setLoading: (key: keyof DataState['loading'], value: boolean) => void;
    setError: (key: keyof DataState['error'], value: string | null) => void;
    clearError: (key: keyof DataState['error']) => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const actions = {
    setJobs: (jobs: Job[]) => dispatch({ type: 'SET_JOBS', payload: jobs }),
    addJob: (job: Job) => dispatch({ type: 'ADD_JOB', payload: job }),
    updateJob: (id: string, data: Partial<Job>) => 
      dispatch({ type: 'UPDATE_JOB', payload: { id, data } }),
    deleteJob: (id: string) => dispatch({ type: 'DELETE_JOB', payload: id }),
    setApplications: (applications: JobApplication[]) => 
      dispatch({ type: 'SET_APPLICATIONS', payload: applications }),
    updateApplication: (id: string, data: Partial<JobApplication>) =>
      dispatch({ type: 'UPDATE_APPLICATION', payload: { id, data } }),
    setCandidateProfile: (profile: CandidateProfile) =>
      dispatch({ type: 'SET_CANDIDATE_PROFILE', payload: profile }),
    setEmployerProfile: (profile: EmployerProfile) =>
      dispatch({ type: 'SET_EMPLOYER_PROFILE', payload: profile }),
    addSavedJob: (jobId: string) => dispatch({ type: 'ADD_SAVED_JOB', payload: jobId }),
    removeSavedJob: (jobId: string) => dispatch({ type: 'REMOVE_SAVED_JOB', payload: jobId }),
    setLoading: (key: keyof DataState['loading'], value: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: { key, value } }),
    setError: (key: keyof DataState['error'], value: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: { key, value } }),
    clearError: (key: keyof DataState['error']) =>
      dispatch({ type: 'CLEAR_ERROR', payload: key }),
  };

  return (
    <DataContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Selector hooks for specific data
export const useJobs = () => {
  const { state } = useData();
  return {
    jobs: state.jobs,
    loading: state.loading.jobs,
    error: state.error.jobs,
  };
};

export const useApplications = () => {
  const { state } = useData();
  return {
    applications: state.applications,
    loading: state.loading.applications,
    error: state.error.applications,
  };
};

export const useCandidateProfile = () => {
  const { state } = useData();
  return {
    profile: state.candidateProfile,
    loading: state.loading.profile,
    error: state.error.profile,
  };
};

export const useEmployerProfile = () => {
  const { state } = useData();
  return {
    profile: state.employerProfile,
    loading: state.loading.profile,
    error: state.error.profile,
  };
};

export const useSavedJobsData = () => {
  const { state } = useData();
  return state.savedJobs;
};
