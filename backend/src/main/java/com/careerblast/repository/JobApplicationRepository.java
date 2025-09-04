package com.careerblast.repository;

import com.careerblast.entity.JobApplication;
import com.careerblast.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {

    Optional<JobApplication> findByUserIdAndJobId(String userId, String jobId);

    Page<JobApplication> findByUserId(String userId, Pageable pageable);

    Page<JobApplication> findByJobId(String jobId, Pageable pageable);

    Page<JobApplication> findByUserIdAndStatus(String userId, ApplicationStatus status, Pageable pageable);

    Page<JobApplication> findByJobIdAndStatus(String jobId, ApplicationStatus status, Pageable pageable);

    // Note: These would need to be implemented in service layer with job lookup
    // Page<JobApplication> findByEmployerId(String employerId, Pageable pageable);
    // Page<JobApplication> findByEmployerIdAndStatus(String employerId, ApplicationStatus status, Pageable pageable);

    boolean existsByUserIdAndJobId(String userId, String jobId);

    long countByUserId(String userId);

    long countByJobId(String jobId);

    @Query("{ 'appliedAt': { $gte: ?0 } }")
    long countByAppliedAtAfter(LocalDateTime startDate);

    @Query(value = "{ 'userId': ?0 }", sort = "{ 'appliedAt': -1 }")
    List<JobApplication> findRecentApplicationsByUser(String userId, Pageable pageable);

    // Additional methods for compatibility
    default long countApplicationsAfter(LocalDateTime startDate) {
        return countByAppliedAtAfter(startDate);
    }
}
