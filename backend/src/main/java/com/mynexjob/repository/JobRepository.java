package com.mynexjob.repository;

import com.mynexjob.entity.Job;
import com.mynexjob.enums.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    Page<Job> findByIsActiveTrue(Pageable pageable);

    Page<Job> findByIsActiveTrueAndIsFeaturedTrue(Pageable pageable);

    Page<Job> findByCompanyId(String companyId, Pageable pageable);

    Page<Job> findByCompanyIdAndIsActiveTrue(String companyId, Pageable pageable);

    @Query("{ 'isActive': true, $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Job> searchJobs(String keyword, Pageable pageable);

    @Query("{ 'isActive': true, 'location': { $regex: ?0, $options: 'i' } }")
    Page<Job> findByLocation(String location, Pageable pageable);

    @Query("{ 'isActive': true, 'jobType': { $in: ?0 } }")
    Page<Job> findByJobTypes(List<JobType> jobTypes, Pageable pageable);

    @Query("{ 'isActive': true, 'skills': { $in: ?0 } }")
    Page<Job> findByRequiredSkills(List<String> skills, Pageable pageable);

    Page<Job> findByIsActiveTrueAndIsRemote(Boolean isRemote, Pageable pageable);

    // Note: These would need to be implemented in service layer with separate collections
    // Page<Job> findSavedJobsByUserId(String userId, Pageable pageable);
    // Page<Job> findAppliedJobsByUserId(String userId, Pageable pageable);

    @Query("{ 'isActive': true }")
    long countByIsActiveTrue();

    @Query("{ 'companyId': ?0, 'isActive': true }")
    long countByCompanyIdAndIsActiveTrue(String companyId);

    @Query("{ 'createdAt': { $gte: ?0 } }")
    long countByCreatedAtAfter(LocalDateTime startDate);

    @Query(value = "{ 'isActive': true }", sort = "{ 'postedAt': -1 }")
    List<Job> findLatestJobs(Pageable pageable);

    @Query(value = "{ 'isActive': true, 'isFeatured': true }", sort = "{ 'postedAt': -1 }")
    List<Job> findFeaturedJobs(Pageable pageable);

    Optional<Job> findByIdAndIsActiveTrue(String id);

    // Matching-specific queries
    List<Job> findByIsActiveTrueAndMatchingEnabledTrue();

    List<Job> findByIsActiveTrueAndIsFeaturedTrueAndMatchingEnabledTrue();

    List<Job> findByIsActiveTrueAndIsFeaturedFalseAndMatchingEnabledTrue();

    // Additional methods for compatibility
    default long countActiveJobs() {
        return countByIsActiveTrue();
    }

    default long countJobsPostedAfter(LocalDateTime date) {
        return countByCreatedAtAfter(date);
    }
}
