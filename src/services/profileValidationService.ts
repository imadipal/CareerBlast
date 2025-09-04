import type { CandidateProfile } from '../types';

export interface ProfileValidationResult {
  isValid: boolean;
  completionPercentage: number;
  missingFields: string[];
  requiredForMatching: {
    hasResume: boolean;
    hasSalaryExpectation: boolean;
    hasExperienceData: boolean;
    hasSkills: boolean;
    hasLocation: boolean;
  };
  recommendations: string[];
}

export interface ProfileCompletionStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  weight: number; // Percentage weight in overall completion
  action: string; // What action user should take
}

export class ProfileValidationService {
  /**
   * Validate candidate profile for job matching eligibility
   */
  validateForMatching(profile: CandidateProfile): ProfileValidationResult {
    const missingFields: string[] = [];
    const recommendations: string[] = [];

    // Check resume upload (MANDATORY)
    const hasResume = this.validateResume(profile);
    if (!hasResume) {
      missingFields.push('resume');
      recommendations.push('Upload your resume - required for all candidates');
    }

    // Check salary expectation
    const hasSalaryExpectation = this.validateSalaryExpectation(profile);
    if (!hasSalaryExpectation) {
      missingFields.push('salary_expectation');
      recommendations.push('Add your salary expectations to see relevant job matches');
    }

    // Check experience data
    const hasExperienceData = this.validateExperienceData(profile);
    if (!hasExperienceData) {
      missingFields.push('experience_years');
      recommendations.push('Update your total years of experience for accurate matching');
    }

    // Check skills
    const hasSkills = this.validateSkills(profile);
    if (!hasSkills) {
      missingFields.push('skills');
      recommendations.push('Add your key skills to improve job matching accuracy');
    }

    // Check location
    const hasLocation = this.validateLocation(profile);
    if (!hasLocation) {
      missingFields.push('location');
      recommendations.push('Set your preferred location for location-based matching');
    }

    // Calculate completion percentage
    const completionPercentage = this.calculateCompletionPercentage(profile);

    // Profile is valid for matching if it has ALL required fields including resume
    const isValid = hasResume && hasSalaryExpectation && hasExperienceData;

    return {
      isValid,
      completionPercentage,
      missingFields,
      requiredForMatching: {
        hasResume,
        hasSalaryExpectation,
        hasExperienceData,
        hasSkills,
        hasLocation,
      },
      recommendations,
    };
  }

  /**
   * Get detailed profile completion steps
   */
  getProfileCompletionSteps(profile: CandidateProfile): ProfileCompletionStep[] {
    const steps: ProfileCompletionStep[] = [
      {
        id: 'basic_info',
        title: 'Basic Information',
        description: 'Complete your name, headline, and summary',
        isCompleted: this.validateBasicInfo(profile),
        isRequired: true,
        weight: 15,
        action: 'Update your profile basics',
      },
      {
        id: 'resume_upload',
        title: 'Resume Upload',
        description: 'Upload your resume - required for all candidates',
        isCompleted: this.validateResume(profile),
        isRequired: true,
        weight: 25,
        action: 'Upload your resume',
      },
      {
        id: 'salary_expectation',
        title: 'Salary Expectations',
        description: 'Set your expected salary range for accurate job matching',
        isCompleted: this.validateSalaryExpectation(profile),
        isRequired: true,
        weight: 20,
        action: 'Add salary expectations',
      },
      {
        id: 'experience_years',
        title: 'Experience Details',
        description: 'Specify your total years of experience and current level',
        isCompleted: this.validateExperienceData(profile),
        isRequired: true,
        weight: 15,
        action: 'Update experience information',
      },
      {
        id: 'skills',
        title: 'Skills & Expertise',
        description: 'Add your key skills and proficiency levels',
        isCompleted: this.validateSkills(profile),
        isRequired: false,
        weight: 10,
        action: 'Add your skills',
      },
      {
        id: 'work_experience',
        title: 'Work Experience',
        description: 'Add your previous work experience and achievements',
        isCompleted: this.validateWorkExperience(profile),
        isRequired: false,
        weight: 10,
        action: 'Add work experience',
      },
      {
        id: 'education',
        title: 'Education',
        description: 'Include your educational background',
        isCompleted: this.validateEducation(profile),
        isRequired: false,
        weight: 10,
        action: 'Add education details',
      },
      {
        id: 'preferences',
        title: 'Job Preferences',
        description: 'Set your job type and location preferences',
        isCompleted: this.validateJobPreferences(profile),
        isRequired: false,
        weight: 5,
        action: 'Set job preferences',
      },
    ];

    return steps;
  }

  /**
   * Calculate overall profile completion percentage
   */
  calculateCompletionPercentage(profile: CandidateProfile): number {
    const steps = this.getProfileCompletionSteps(profile);
    const totalWeight = steps.reduce((sum, step) => sum + step.weight, 0);
    const completedWeight = steps
      .filter(step => step.isCompleted)
      .reduce((sum, step) => sum + step.weight, 0);

    return Math.round((completedWeight / totalWeight) * 100);
  }

  /**
   * Get next recommended action for profile completion
   */
  getNextRecommendedAction(profile: CandidateProfile): ProfileCompletionStep | null {
    const steps = this.getProfileCompletionSteps(profile);
    
    // First, find incomplete required steps
    const incompleteRequired = steps.filter(step => step.isRequired && !step.isCompleted);
    if (incompleteRequired.length > 0) {
      return incompleteRequired[0];
    }

    // Then, find incomplete optional steps with highest weight
    const incompleteOptional = steps
      .filter(step => !step.isRequired && !step.isCompleted)
      .sort((a, b) => b.weight - a.weight);
    
    return incompleteOptional.length > 0 ? incompleteOptional[0] : null;
  }

  /**
   * Check if profile meets minimum requirements for job recommendations
   */
  meetsMinimumRequirements(profile: CandidateProfile): boolean {
    return this.validateResume(profile) && this.validateSalaryExpectation(profile) && this.validateExperienceData(profile);
  }

  /**
   * Generate profile improvement suggestions
   */
  getImprovementSuggestions(profile: CandidateProfile): string[] {
    const suggestions: string[] = [];
    const validation = this.validateForMatching(profile);

    // Resume is MANDATORY - prioritize this
    if (!validation.requiredForMatching.hasResume) {
      suggestions.push('🚨 REQUIRED: Upload your resume - mandatory for all candidates');
    }

    if (!validation.requiredForMatching.hasSalaryExpectation) {
      suggestions.push('Add your salary expectations to unlock personalized job recommendations');
    }

    if (!validation.requiredForMatching.hasExperienceData) {
      suggestions.push('Update your experience details to improve matching accuracy');
    }

    if (!validation.requiredForMatching.hasSkills || profile.skills.length < 5) {
      suggestions.push('Add more skills to your profile to increase job match opportunities');
    }

    if (profile.experience.length === 0) {
      suggestions.push('Add your work experience to showcase your background to employers');
    }

    if (profile.education.length === 0) {
      suggestions.push('Include your education to complete your professional profile');
    }

    if (validation.completionPercentage < 80) {
      suggestions.push('Complete your profile to increase visibility to recruiters');
    }

    return suggestions;
  }

  // Private validation methods

  private validateBasicInfo(profile: CandidateProfile): boolean {
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.headline &&
      profile.summary &&
      profile.summary.length >= 50
    );
  }

  private validateSalaryExpectation(profile: CandidateProfile): boolean {
    const salary = profile.preferences.salaryExpectation;
    return !!(
      salary &&
      salary.min > 0 &&
      salary.max > 0 &&
      salary.min <= salary.max &&
      salary.currency
    );
  }

  private validateExperienceData(profile: CandidateProfile): boolean {
    return !!(
      profile.totalExperienceYears >= 0 &&
      profile.currentExperienceLevel &&
      ['entry', 'mid', 'senior', 'executive'].includes(profile.currentExperienceLevel)
    );
  }

  private validateSkills(profile: CandidateProfile): boolean {
    return profile.skills && profile.skills.length >= 3;
  }

  private validateLocation(profile: CandidateProfile): boolean {
    return !!(profile.location && profile.location.trim().length > 0);
  }

  private validateWorkExperience(profile: CandidateProfile): boolean {
    return profile.experience && profile.experience.length > 0;
  }

  private validateEducation(profile: CandidateProfile): boolean {
    return profile.education && profile.education.length > 0;
  }

  private validateJobPreferences(profile: CandidateProfile): boolean {
    const prefs = profile.preferences;
    return !!(
      prefs.jobTypes &&
      prefs.jobTypes.length > 0 &&
      prefs.locations &&
      prefs.locations.length > 0
    );
  }

  private validateResume(profile: CandidateProfile): boolean {
    return !!(profile.resume && profile.resume.trim().length > 0);
  }
}

// Export singleton instance
export const profileValidationService = new ProfileValidationService();

// Helper function to check if candidate can see job recommendations
export const canViewJobRecommendations = (profile: CandidateProfile): boolean => {
  return profileValidationService.meetsMinimumRequirements(profile);
};

// Helper function to get profile completion status
export const getProfileCompletionStatus = (profile: CandidateProfile) => {
  const validation = profileValidationService.validateForMatching(profile);
  const nextAction = profileValidationService.getNextRecommendedAction(profile);
  const suggestions = profileValidationService.getImprovementSuggestions(profile);

  return {
    ...validation,
    nextAction,
    suggestions,
    canViewRecommendations: validation.isValid,
  };
};
