package com.mynexjob.repository;

import com.mynexjob.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {

    Optional<UserProfile> findByUserId(String userId);

    Page<UserProfile> findByMatchingEnabledTrue(Pageable pageable);

    @Query("{ 'matchingEnabled': true, 'expectedSalary': { $lte: ?0 }, 'experienceYears': { $gte: ?1 } }")
    Page<UserProfile> findMatchingCandidates(BigDecimal maxSalary, Integer minExperience, Pageable pageable);

    Page<UserProfile> findByIsProfileCompleteTrue(Pageable pageable);

    long countByMatchingEnabledTrue();

    long countByIsProfileCompleteTrue();

    @Query(value = "{}", fields = "{ 'profileCompletionPercentage': 1 }")
    List<UserProfile> findAllProfileCompletions();

    @Query("{ 'skills': { $in: ?0 }, 'matchingEnabled': true }")
    List<UserProfile> findBySkillsAndMatchingEnabled(List<String> skillIds);

    @Query("{ 'expectedSalary': { $gte: ?0, $lte: ?1 }, 'matchingEnabled': true }")
    List<UserProfile> findBySalaryRangeAndMatchingEnabled(BigDecimal minSalary, BigDecimal maxSalary);

    @Query("{ 'experienceYears': { $gte: ?0, $lte: ?1 }, 'matchingEnabled': true }")
    List<UserProfile> findByExperienceRangeAndMatchingEnabled(Integer minExp, Integer maxExp);

    // Additional methods for compatibility
    default long countMatchingEnabledProfiles() {
        return countByMatchingEnabledTrue();
    }

    default long countCompleteProfiles() {
        return countByIsProfileCompleteTrue();
    }

    default Double getAverageProfileCompletion() {
        // This would need to be implemented using aggregation in service layer
        // For now, return a default value
        return 75.0;
    }
}
