import { useState, useEffect, useCallback } from 'react';
import type { CandidateProfile, WorkExperience, Education, Skill } from '../types';
// import { candidatesAPI } from '../services/api';
import { mockCandidateProfile } from '../data/candidates';

interface UseProfileReturn {
  profile: CandidateProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<CandidateProfile>) => Promise<void>;
  addExperience: (experience: Omit<WorkExperience, 'id'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<WorkExperience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addEducation: (education: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, education: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  uploadResume: (file: File) => Promise<void>;
}

export const useProfile = (userId?: string): UseProfileReturn => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, use mock data
      // In production, uncomment the API call below
      // const response = await candidatesAPI.getProfile(userId);
      // setProfile(response.data);
      
      setProfile(mockCandidateProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<CandidateProfile>) => {
    try {
      // For demo purposes, update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // In production, use API call:
      // await candidatesAPI.updateProfile(data);
      // await fetchProfile(); // Refetch to get updated data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const addExperience = async (experience: Omit<WorkExperience, 'id'>) => {
    try {
      const newExperience: WorkExperience = {
        ...experience,
        id: `exp-${Date.now()}`,
      };

      setProfile(prev => prev ? {
        ...prev,
        experience: [newExperience, ...prev.experience]
      } : null);

      // In production, use API call to add experience
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add experience');
    }
  };

  const updateExperience = async (id: string, experience: Partial<WorkExperience>) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        experience: prev.experience.map(exp => 
          exp.id === id ? { ...exp, ...experience } : exp
        )
      } : null);

      // In production, use API call to update experience
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update experience');
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
      } : null);

      // In production, use API call to delete experience
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete experience');
    }
  };

  const addEducation = async (education: Omit<Education, 'id'>) => {
    try {
      const newEducation: Education = {
        ...education,
        id: `edu-${Date.now()}`,
      };

      setProfile(prev => prev ? {
        ...prev,
        education: [newEducation, ...prev.education]
      } : null);

      // In production, use API call to add education
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add education');
    }
  };

  const updateEducation = async (id: string, education: Partial<Education>) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        education: prev.education.map(edu => 
          edu.id === id ? { ...edu, ...education } : edu
        )
      } : null);

      // In production, use API call to update education
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update education');
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      } : null);

      // In production, use API call to delete education
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete education');
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    try {
      const newSkill: Skill = {
        ...skill,
        id: `skill-${Date.now()}`,
      };

      setProfile(prev => prev ? {
        ...prev,
        skills: [...prev.skills, newSkill]
      } : null);

      // In production, use API call to add skill
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add skill');
    }
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        skills: prev.skills.map(s => 
          s.id === id ? { ...s, ...skill } : s
        )
      } : null);

      // In production, use API call to update skill
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update skill');
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      setProfile(prev => prev ? {
        ...prev,
        skills: prev.skills.filter(s => s.id !== id)
      } : null);

      // In production, use API call to delete skill
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete skill');
    }
  };

  const uploadResume = async (file: File) => {
    try {
      // For demo purposes, create a mock file URL
      const mockFileUrl = URL.createObjectURL(file);
      
      setProfile(prev => prev ? {
        ...prev,
        resume: {
          url: mockFileUrl,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
        }
      } : null);

      // In production, use API call:
      // const response = await candidatesAPI.uploadResume(file);
      // setProfile(prev => prev ? { ...prev, resume: response.data } : null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload resume');
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    uploadResume,
  };
};
