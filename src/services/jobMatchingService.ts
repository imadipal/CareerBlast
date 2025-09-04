import type { 
  Job, 
  CandidateProfile, 
  JobMatch, 
  StrictFilterResult, 
  MatchingConfig 
} from '../types';

// Default matching configuration
const DEFAULT_CONFIG: MatchingConfig = {
  minimumMatchThreshold: 70,
  enableStrictFilters: true,
  salaryFilterEnabled: true,
  experienceFilterEnabled: true,
  aiMatchingEnabled: true,
};

export class JobMatchingService {
  private config: MatchingConfig;
  private openAIApiKey?: string;

  constructor(config: Partial<MatchingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  /**
   * Main method to find matching jobs for a candidate
   * Applies strict filters first, then calculates match percentages
   */
  async findMatchingJobs(
    candidate: CandidateProfile,
    availableJobs: Job[]
  ): Promise<JobMatch[]> {
    // Validate candidate has required data for matching
    if (!this.validateCandidateProfile(candidate)) {
      throw new Error('Candidate profile incomplete. Missing salary expectations or experience data.');
    }

    const matches: JobMatch[] = [];

    for (const job of availableJobs) {
      // Skip inactive jobs
      if (!job.isActive || !job.matchingEnabled) {
        continue;
      }

      // Apply strict filters first
      const strictFilterResult = this.applyStrictFilters(candidate, job);
      
      if (!strictFilterResult.passesFilters) {
        // Job doesn't pass strict filters, skip it
        continue;
      }

      // Calculate match percentage using AI or rule-based matching
      const matchPercentage = await this.calculateMatchPercentage(candidate, job);

      // Only include jobs that meet the minimum threshold
      if (matchPercentage >= this.config.minimumMatchThreshold) {
        const jobMatch = await this.createJobMatch(
          candidate,
          job,
          matchPercentage,
          strictFilterResult
        );
        matches.push(jobMatch);
      }
    }

    // Sort by match percentage (highest first)
    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Apply strict filters (salary and experience) before matching
   */
  private applyStrictFilters(candidate: CandidateProfile, job: Job): StrictFilterResult {
    const filterReasons: string[] = [];
    let salaryMatch = true;
    let experienceMatch = true;

    // Salary Filter (Strict Rule)
    if (this.config.salaryFilterEnabled && job.actualSalaryMin !== undefined) {
      const candidateMinSalary = candidate.preferences.salaryExpectation.min;
      
      // Job's actual salary must be >= candidate's expected salary
      if (job.actualSalaryMin < candidateMinSalary) {
        salaryMatch = false;
        filterReasons.push(`Offered salary (${job.actualSalaryMin}) below expectation (${candidateMinSalary})`);
      }
    }

    // Experience Filter (Strict Rule)
    if (this.config.experienceFilterEnabled) {
      const candidateExperience = candidate.totalExperienceYears;
      const requiredExperience = job.experienceMin;
      
      // Candidate's experience must be >= job's required experience
      if (candidateExperience < requiredExperience) {
        experienceMatch = false;
        filterReasons.push(`Experience ${candidateExperience} years < required ${requiredExperience} years`);
      }
    }

    const passesFilters = salaryMatch && experienceMatch;

    return {
      passesFilters,
      salaryMatch,
      experienceMatch,
      filterReasons,
    };
  }

  /**
   * Calculate match percentage using AI or rule-based approach
   */
  private async calculateMatchPercentage(
    candidate: CandidateProfile,
    job: Job
  ): Promise<number> {
    if (this.config.aiMatchingEnabled && this.openAIApiKey) {
      try {
        return await this.calculateAIMatch(candidate, job);
      } catch (error) {
        console.warn('AI matching failed, falling back to rule-based matching:', error);
        return this.calculateRuleBasedMatch(candidate, job);
      }
    }

    return this.calculateRuleBasedMatch(candidate, job);
  }

  /**
   * AI-powered matching using ChatGPT API
   */
  private async calculateAIMatch(candidate: CandidateProfile, job: Job): Promise<number> {
    const prompt = this.buildMatchingPrompt(candidate, job);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruitment AI that calculates job-candidate match percentages. Return only a number between 0-100 representing the match percentage, followed by a brief explanation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Extract percentage from response
    const percentageMatch = content.match(/(\d+(?:\.\d+)?)/);
    if (percentageMatch) {
      return Math.min(100, Math.max(0, parseFloat(percentageMatch[1])));
    }

    throw new Error('Could not parse AI response');
  }

  /**
   * Rule-based matching as fallback
   */
  private calculateRuleBasedMatch(candidate: CandidateProfile, job: Job): number {
    let totalScore = 0;
    let maxScore = 0;

    // Skills matching (40% weight)
    const skillsScore = this.calculateSkillsMatch(candidate.skills, job.skills);
    totalScore += skillsScore * 0.4;
    maxScore += 40;

    // Experience level matching (25% weight)
    const experienceScore = this.calculateExperienceLevelMatch(
      candidate.currentExperienceLevel,
      job.experienceLevel
    );
    totalScore += experienceScore * 0.25;
    maxScore += 25;

    // Location matching (15% weight)
    const locationScore = this.calculateLocationMatch(candidate.location, job.location);
    totalScore += locationScore * 0.15;
    maxScore += 15;

    // Job type preference matching (10% weight)
    const jobTypeScore = this.calculateJobTypeMatch(candidate.preferences.jobTypes, job.jobType);
    totalScore += jobTypeScore * 0.1;
    maxScore += 10;

    // Education matching (10% weight)
    const educationScore = this.calculateEducationMatch(candidate.education, job.requirements);
    totalScore += educationScore * 0.1;
    maxScore += 10;

    return Math.round((totalScore / maxScore) * 100);
  }

  /**
   * Build prompt for AI matching
   */
  private buildMatchingPrompt(candidate: CandidateProfile, job: Job): string {
    return `
Analyze the match between this candidate and job posting:

CANDIDATE PROFILE:
- Experience: ${candidate.totalExperienceYears} years (${candidate.currentExperienceLevel} level)
- Skills: ${candidate.skills.map(s => s.name).join(', ')}
- Location: ${candidate.location}
- Job Type Preferences: ${candidate.preferences.jobTypes.join(', ')}
- Summary: ${candidate.summary}

JOB POSTING:
- Title: ${job.title}
- Company: ${job.company.name}
- Required Experience: ${job.experienceMin}+ years (${job.experienceLevel} level)
- Required Skills: ${job.skills.join(', ')}
- Location: ${job.location}
- Job Type: ${job.jobType}
- Description: ${job.description}
- Requirements: ${job.requirements.join(', ')}

Calculate a match percentage (0-100) based on:
1. Skills alignment and transferability
2. Experience level appropriateness
3. Career progression fit
4. Location and work arrangement compatibility
5. Overall role suitability

Provide the percentage and brief explanation.
    `.trim();
  }

  /**
   * Calculate skills match percentage
   */
  private calculateSkillsMatch(candidateSkills: any[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100;

    const candidateSkillNames = candidateSkills.map(s => s.name.toLowerCase());
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    const matchedSkills = jobSkillsLower.filter(skill =>
      candidateSkillNames.some(candidateSkill =>
        candidateSkill.includes(skill) || skill.includes(candidateSkill)
      )
    );

    return (matchedSkills.length / jobSkillsLower.length) * 100;
  }

  /**
   * Calculate experience level match
   */
  private calculateExperienceLevelMatch(
    candidateLevel: string,
    jobLevel: string
  ): number {
    const levels = ['entry', 'mid', 'senior', 'executive'];
    const candidateIndex = levels.indexOf(candidateLevel);
    const jobIndex = levels.indexOf(jobLevel);

    if (candidateIndex === jobIndex) return 100;
    if (Math.abs(candidateIndex - jobIndex) === 1) return 75;
    if (Math.abs(candidateIndex - jobIndex) === 2) return 50;
    return 25;
  }

  /**
   * Calculate location match
   */
  private calculateLocationMatch(candidateLocation: string, jobLocation: string): number {
    if (jobLocation.toLowerCase().includes('remote')) return 100;
    if (candidateLocation.toLowerCase() === jobLocation.toLowerCase()) return 100;
    
    // Check if candidate prefers remote work
    // This would need to be enhanced with actual location matching logic
    return 60; // Partial match for different locations
  }

  /**
   * Calculate job type match
   */
  private calculateJobTypeMatch(preferredTypes: string[], jobType: string): number {
    return preferredTypes.includes(jobType) ? 100 : 50;
  }

  /**
   * Calculate education match (simplified)
   */
  private calculateEducationMatch(education: any[], requirements: string[]): number {
    // Simplified education matching - would need more sophisticated logic
    return education.length > 0 ? 80 : 60;
  }

  /**
   * Create JobMatch object with detailed information
   */
  private async createJobMatch(
    candidate: CandidateProfile,
    job: Job,
    matchPercentage: number,
    strictFilterResult: StrictFilterResult
  ): Promise<JobMatch> {
    const skillsMatch = this.analyzeSkillsMatch(candidate.skills, job.skills);
    const matchReasons = this.generateMatchReasons(candidate, job, matchPercentage);
    const matchExplanation = await this.generateMatchExplanation(candidate, job, matchPercentage);

    return {
      id: `match-${candidate.id}-${job.id}-${Date.now()}`,
      job,
      matchPercentage,
      matchReasons,
      skillsMatch,
      salaryMatches: strictFilterResult.salaryMatch,
      experienceMatches: strictFilterResult.experienceMatch,
      locationMatch: this.calculateLocationMatch(candidate.location, job.location) > 70,
      matchExplanation,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze skills match in detail
   */
  private analyzeSkillsMatch(candidateSkills: any[], jobSkills: string[]) {
    const candidateSkillNames = candidateSkills.map(s => s.name.toLowerCase());
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    const matched = jobSkillsLower.filter(skill =>
      candidateSkillNames.some(candidateSkill =>
        candidateSkill.includes(skill) || skill.includes(candidateSkill)
      )
    );

    const missing = jobSkillsLower.filter(skill => !matched.includes(skill));
    const additional = candidateSkillNames.filter(skill =>
      !jobSkillsLower.some(jobSkill =>
        skill.includes(jobSkill) || jobSkill.includes(skill)
      )
    );

    return {
      matched,
      missing,
      additional,
      percentage: jobSkillsLower.length > 0 ? (matched.length / jobSkillsLower.length) * 100 : 100,
    };
  }

  /**
   * Generate match reasons
   */
  private generateMatchReasons(candidate: CandidateProfile, job: Job, matchPercentage: number): string[] {
    const reasons: string[] = [];

    if (matchPercentage >= 90) {
      reasons.push('Excellent overall match');
    } else if (matchPercentage >= 80) {
      reasons.push('Strong match with good alignment');
    } else if (matchPercentage >= 70) {
      reasons.push('Good match with some areas for growth');
    }

    // Add specific reasons based on matching criteria
    const skillsMatch = this.calculateSkillsMatch(candidate.skills, job.skills);
    if (skillsMatch >= 80) {
      reasons.push('Strong skills alignment');
    }

    if (candidate.currentExperienceLevel === job.experienceLevel) {
      reasons.push('Perfect experience level match');
    }

    return reasons;
  }

  /**
   * Generate detailed match explanation
   */
  private async generateMatchExplanation(
    candidate: CandidateProfile,
    job: Job,
    matchPercentage: number
  ): Promise<string> {
    // This could use AI for more detailed explanations
    const skillsMatch = this.calculateSkillsMatch(candidate.skills, job.skills);
    
    if (matchPercentage >= 85) {
      return `Excellent match! Your ${candidate.totalExperienceYears} years of experience and ${Math.round(skillsMatch)}% skills alignment make you a strong candidate for this ${job.experienceLevel} level position.`;
    } else if (matchPercentage >= 75) {
      return `Good match! Your background aligns well with this role, with ${Math.round(skillsMatch)}% skills overlap and appropriate experience level.`;
    } else {
      return `Potential match! While there are some gaps, your core skills and experience provide a foundation for this role with room for growth.`;
    }
  }

  /**
   * Validate that candidate has required data for matching
   */
  private validateCandidateProfile(candidate: CandidateProfile): boolean {
    return (
      candidate.preferences.salaryExpectation.min > 0 &&
      candidate.totalExperienceYears >= 0 &&
      candidate.hasRequiredMatchingData
    );
  }
}

// Export singleton instance
export const jobMatchingService = new JobMatchingService();
