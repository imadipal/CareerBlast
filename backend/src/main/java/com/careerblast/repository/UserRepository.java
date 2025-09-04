package com.careerblast.repository;

import com.careerblast.entity.User;
import com.careerblast.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailVerificationToken(String token);

    Optional<User> findByPasswordResetToken(String token);

    boolean existsByEmail(String email);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Page<User> findByIsActive(Boolean isActive, Pageable pageable);

    Page<User> findByRoleAndIsActive(UserRole role, Boolean isActive, Pageable pageable);

    @Query("{ $or: [ " +
           "{ 'firstName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'lastName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'email': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<User> searchUsers(String keyword, Pageable pageable);

    long countByRole(UserRole role);

    @Query("{ 'createdAt': { $gte: ?0 } }")
    long countByCreatedAtAfter(LocalDateTime startDate);

    List<User> findByRoleAndIsEmailVerified(UserRole role, Boolean isEmailVerified);

    // Additional methods for compatibility
    default void updateLastLoginTime(String userId, LocalDateTime loginTime) {
        // This would need to be implemented using MongoTemplate for atomic updates
        // For now, we'll handle this in the service layer
    }

    default void verifyEmail(String userId) {
        // This would need to be implemented using MongoTemplate for atomic updates
        // For now, we'll handle this in the service layer
    }

    default long countUsersRegisteredAfter(LocalDateTime date) {
        return countByCreatedAtAfter(date);
    }
}
