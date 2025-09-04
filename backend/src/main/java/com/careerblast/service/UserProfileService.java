package com.careerblast.service;

import com.careerblast.dto.profile.CreateProfileRequest;
import com.careerblast.dto.profile.UserProfileDto;
import com.careerblast.entity.*;
import com.careerblast.exception.BadRequestException;
import com.careerblast.exception.ResourceNotFoundException;
import com.careerblast.mapper.UserProfileMapper;
import com.careerblast.repository.SkillRepository;
import com.careerblast.repository.UserProfileRepository;
import com.careerblast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserProfileMapper userProfileMapper;

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(null);

        if (profile == null) {
            return null;
        }

        return userProfileMapper.toDto(profile);
    }

    @Transactional
    public UserProfileDto createOrUpdateProfile(String userEmail, CreateProfileRequest request) {
        log.info("Creating/updating profile for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder()
                        .userId(user.getId())
                        .build());

        // Update basic profile information
        profile.setTitle(request.getTitle());
        profile.setSummary(request.getSummary());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setCurrentSalary(request.getCurrentSalary());
        profile.setExpectedSalary(request.getExpectedSalary());
        profile.setCurrency(request.getCurrency());
        profile.setAvailabilityDate(request.getAvailabilityDate());
        profile.setIsOpenToRemote(request.getIsOpenToRemote());
        profile.setIsOpenToRelocation(request.getIsOpenToRelocation());
        profile.setPreferredLocations(request.getPreferredLocations());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setCoverLetterUrl(request.getCoverLetterUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());

        // Update skills
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            List<String> skillIds = request.getSkillIds().stream()
                    .map(String::valueOf)
                    .collect(java.util.stream.Collectors.toList());
            profile.setSkills(skillIds);
        }

        // Update work experiences
        if (request.getWorkExperiences() != null) {
            profile.getWorkExperiences().clear();
            final UserProfile finalProfile = profile;
            request.getWorkExperiences().forEach(workExpReq -> {
                WorkExperience workExp = WorkExperience.builder()
                        .userProfileId(finalProfile.getId())
                        .companyName(workExpReq.getCompanyName())
                        .position(workExpReq.getPosition())
                        .description(workExpReq.getDescription())
                        .startDate(workExpReq.getStartDate())
                        .endDate(workExpReq.getEndDate())
                        .isCurrent(workExpReq.getIsCurrent())
                        .location(workExpReq.getLocation())
                        .companyUrl(workExpReq.getCompanyUrl())
                        .achievements(workExpReq.getAchievements())
                        .build();
                finalProfile.getWorkExperiences().add(workExp);
            });
        }

        // Update educations
        if (request.getEducations() != null) {
            profile.getEducations().clear();
            final UserProfile finalProfile2 = profile;
            request.getEducations().forEach(eduReq -> {
                Education education = Education.builder()
                        .userProfileId(finalProfile2.getId())
                        .institution(eduReq.getInstitution())
                        .degree(eduReq.getDegree())
                        .fieldOfStudy(eduReq.getFieldOfStudy())
                        .startDate(eduReq.getStartDate())
                        .endDate(eduReq.getEndDate())
                        .isCurrent(eduReq.getIsCurrent())
                        .grade(eduReq.getGrade())
                        .description(eduReq.getDescription())
                        .location(eduReq.getLocation())
                        .build();
                finalProfile2.getEducations().add(education);
            });
        }

        // Update certifications
        if (request.getCertifications() != null) {
            profile.getCertifications().clear();
            final UserProfile finalProfile3 = profile;
            request.getCertifications().forEach(certReq -> {
                Certification certification = Certification.builder()
                        .userProfileId(finalProfile3.getId())
                        .name(certReq.getName())
                        .issuingOrganization(certReq.getIssuingOrganization())
                        .issueDate(certReq.getIssueDate())
                        .expiryDate(certReq.getExpiryDate())
                        .credentialId(certReq.getCredentialId())
                        .credentialUrl(certReq.getCredentialUrl())
                        .description(certReq.getDescription())
                        .doesNotExpire(certReq.getDoesNotExpire())
                        .build();
                finalProfile3.getCertifications().add(certification);
            });
        }

        // Calculate profile completion
        profile.calculateProfileCompletion();

        profile = userProfileRepository.save(profile);

        log.info("Profile updated for user: {}. Completion: {}%, Matching enabled: {}", 
                userEmail, profile.getProfileCompletionPercentage(), profile.getMatchingEnabled());

        return userProfileMapper.toDto(profile);
    }

    @Transactional(readOnly = true)
    public boolean isProfileComplete(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userProfileRepository.findByUserId(user.getId())
                .map(UserProfile::getIsProfileComplete)
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean isMatchingEnabled(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userProfileRepository.findByUserId(user.getId())
                .map(UserProfile::getMatchingEnabled)
                .orElse(false);
    }

    @Transactional
    public void enableMatching(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Profile not found. Please complete your profile first."));

        if (!profile.meetsMatchingRequirements()) {
            throw new BadRequestException("Profile does not meet minimum requirements for matching. " +
                    "Please ensure you have provided: expected salary, experience years, title, and at least one skill.");
        }

        profile.setMatchingEnabled(true);
        userProfileRepository.save(profile);

        log.info("Matching enabled for user: {}", userEmail);
    }

    @Transactional
    public void disableMatching(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Profile not found"));

        profile.setMatchingEnabled(false);
        userProfileRepository.save(profile);

        log.info("Matching disabled for user: {}", userEmail);
    }

    // Additional methods for compatibility
    public UserProfile getOrCreateProfile(String userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    return createDefaultProfile(user);
                });
    }

    public UserProfile getProfile(String userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
    }

    public void updateProfile(String userId, UserProfile profile) {
        profile.setUserId(userId);
        userProfileRepository.save(profile);
    }

    private UserProfile createDefaultProfile(User user) {
        UserProfile profile = UserProfile.builder()
                .userId(user.getId())
                .build();
        return userProfileRepository.save(profile);
    }
}
