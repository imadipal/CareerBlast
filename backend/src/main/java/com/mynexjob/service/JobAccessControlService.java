package com.mynexjob.service;

import com.mynexjob.entity.Job;
import com.mynexjob.entity.JobApplication;
import com.mynexjob.entity.User;
import com.mynexjob.enums.JobCategory;
import com.mynexjob.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobAccessControlService {

    private final SubscriptionService subscriptionService;

    /**
     * Check if user can access job details
     */
    public boolean canAccessJob(User user, Job job) {
        // Job seekers can always access job details
        if (user.getRole() == UserRole.USER) {
            return true;
        }
        
        // For employers, check if it's their own job or if they have subscription for IT jobs
        if (user.getRole() == UserRole.EMPLOYER) {
            // Can access their own jobs
            if (job.getCompany().getUser().getId().equals(user.getId())) {
                return true;
            }
            
            // For other jobs, check subscription if it's IT job
            if (job.getJobCategory() == JobCategory.IT) {
                return subscriptionService.hasActiveITSubscription(user.getId());
            }
            
            // Non-IT jobs are free for all employers
            return true;
        }
        
        return false;
    }

    /**
     * Check if employer can access job application data
     */
    public boolean canAccessJobApplication(User employer, JobApplication application) {
        // Only employers can access applications
        if (employer.getRole() != UserRole.EMPLOYER) {
            return false;
        }
        
        Job job = application.getJob();
        
        // Can access applications for their own jobs
        if (job.getCompany().getUser().getId().equals(employer.getId())) {
            return true;
        }
        
        // For IT jobs, need active subscription
        if (job.getJobCategory() == JobCategory.IT) {
            boolean hasSubscription = subscriptionService.hasActiveITSubscription(employer.getId());
            boolean canAccessMore = subscriptionService.canAccessITApplication(employer.getId());
            
            if (hasSubscription && canAccessMore) {
                // Increment usage when accessing
                subscriptionService.incrementApplicationUsage(employer.getId());
                return true;
            }
            return false;
        }
        
        // Non-IT job applications are free
        return true;
    }

    /**
     * Check if employer can view candidate profile for IT jobs
     */
    public boolean canViewCandidateProfile(User employer, User candidate, Job job) {
        // Only employers can view candidate profiles
        if (employer.getRole() != UserRole.EMPLOYER) {
            return false;
        }
        
        // For IT jobs, need active subscription
        if (job.getJobCategory() == JobCategory.IT) {
            boolean hasSubscription = subscriptionService.hasActiveITSubscription(employer.getId());
            boolean canAccessMore = subscriptionService.canAccessITApplication(employer.getId());
            
            if (hasSubscription && canAccessMore) {
                // Increment usage when viewing profile
                subscriptionService.incrementApplicationUsage(employer.getId());
                return true;
            }
            return false;
        }
        
        // Non-IT job candidate profiles are free
        return true;
    }

    /**
     * Check if employer can download candidate resume
     */
    public boolean canDownloadResume(User employer, JobApplication application) {
        return canAccessJobApplication(employer, application);
    }

    /**
     * Check if employer can contact candidate
     */
    public boolean canContactCandidate(User employer, User candidate, Job job) {
        return canViewCandidateProfile(employer, candidate, job);
    }

    /**
     * Get access restriction message for IT jobs
     */
    public String getAccessRestrictionMessage(User user, Job job) {
        if (job.getJobCategory() == JobCategory.IT && user.getRole() == UserRole.EMPLOYER) {
            if (!subscriptionService.hasActiveITSubscription(user.getId())) {
                return "This is an IT job. You need an active subscription to access candidate data. Please upgrade your plan to view applications.";
            }
            
            if (!subscriptionService.canAccessITApplication(user.getId())) {
                Integer remaining = subscriptionService.getRemainingApplications(user.getId());
                return String.format("You have reached your monthly limit of IT job applications. Remaining: %d. Please upgrade your plan for more access.", remaining);
            }
        }
        
        return null;
    }

    /**
     * Check if job posting requires subscription validation
     */
    public boolean requiresSubscriptionForPosting(Job job) {
        // Currently, posting jobs doesn't require subscription
        // Only accessing candidate data requires subscription
        return false;
    }

    /**
     * Validate subscription before accessing IT job data
     */
    public void validateITJobAccess(User employer, Job job) {
        if (job.getJobCategory() == JobCategory.IT && employer.getRole() == UserRole.EMPLOYER) {
            if (!subscriptionService.hasActiveITSubscription(employer.getId())) {
                throw new RuntimeException("Active subscription required to access IT job candidate data");
            }
            
            if (!subscriptionService.canAccessITApplication(employer.getId())) {
                throw new RuntimeException("Monthly application limit reached. Please upgrade your plan.");
            }
        }
    }

    /**
     * Get subscription requirement info for job
     */
    public SubscriptionRequirement getSubscriptionRequirement(Job job, User user) {
        if (job.getJobCategory() == JobCategory.IT && user.getRole() == UserRole.EMPLOYER) {
            boolean hasSubscription = subscriptionService.hasActiveITSubscription(user.getId());
            boolean canAccess = subscriptionService.canAccessITApplication(user.getId());
            Integer remaining = subscriptionService.getRemainingApplications(user.getId());
            
            return new SubscriptionRequirement(
                true, // requires subscription
                hasSubscription,
                canAccess,
                remaining,
                "IT Job - Subscription Required"
            );
        }
        
        return new SubscriptionRequirement(
            false, // no subscription required
            true,  // has access
            true,  // can access
            -1,    // unlimited
            "Free Access"
        );
    }

    public static class SubscriptionRequirement {
        public final boolean requiresSubscription;
        public final boolean hasActiveSubscription;
        public final boolean canAccess;
        public final Integer remainingApplications;
        public final String message;

        public SubscriptionRequirement(boolean requiresSubscription, boolean hasActiveSubscription, 
                                     boolean canAccess, Integer remainingApplications, String message) {
            this.requiresSubscription = requiresSubscription;
            this.hasActiveSubscription = hasActiveSubscription;
            this.canAccess = canAccess;
            this.remainingApplications = remainingApplications;
            this.message = message;
        }
    }
}
