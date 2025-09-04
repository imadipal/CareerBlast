package com.mynexjob.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.PostConstruct;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MongoIndexConfig {

    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void createIndexes() {
        log.info("Skipping MongoDB index creation for development...");
        // Temporarily disabled to avoid index conflicts during development
        // TODO: Enable index creation for production or clear existing database

        // createUserIndexes();
        // createJobIndexes();
        // createCompanyIndexes();
        // createUserProfileIndexes();
        // createJobApplicationIndexes();
        // createSubscriptionIndexes();
        // createSkillIndexes();

        log.info("MongoDB index creation skipped");
    }

    private void createUserIndexes() {
        try {
            IndexOperations userIndexOps = mongoTemplate.indexOps("users");

            // Unique index on email (most frequent query)
            createIndexSafely(userIndexOps, new Index().on("email", org.springframework.data.domain.Sort.Direction.ASC).unique(), "email_unique");

            // Index on role for role-based queries
            createIndexSafely(userIndexOps, new Index().on("role", org.springframework.data.domain.Sort.Direction.ASC), "role_idx");

            // Index on isActive for filtering active users
            createIndexSafely(userIndexOps, new Index().on("isActive", org.springframework.data.domain.Sort.Direction.ASC), "isActive_idx");

            // Index on isEmailVerified for filtering verified users
            createIndexSafely(userIndexOps, new Index().on("isEmailVerified", org.springframework.data.domain.Sort.Direction.ASC), "isEmailVerified_idx");

            // Compound index for role and active status
            createIndexSafely(userIndexOps, new Index()
                    .on("role", org.springframework.data.domain.Sort.Direction.ASC)
                    .on("isActive", org.springframework.data.domain.Sort.Direction.ASC), "role_active_idx");

            // Index on createdAt for analytics and sorting
            createIndexSafely(userIndexOps, new Index().on("createdAt", org.springframework.data.domain.Sort.Direction.DESC), "createdAt_idx");
        } catch (Exception e) {
            log.warn("Error creating user indexes: {}", e.getMessage());
        }
    }

    private void createIndexSafely(IndexOperations indexOps, Index index, String indexName) {
        try {
            index.named(indexName);
            indexOps.ensureIndex(index);
        } catch (Exception e) {
            log.warn("Failed to create index {}: {}", indexName, e.getMessage());
        }
    }

    private void createJobIndexes() {
        IndexOperations jobIndexOps = mongoTemplate.indexOps("jobs");
        
        // Index on isActive (most frequent filter)
        jobIndexOps.ensureIndex(new Index().on("isActive", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on companyId for company-specific job queries
        jobIndexOps.ensureIndex(new Index().on("companyId", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on jobCategory for category filtering
        jobIndexOps.ensureIndex(new Index().on("jobCategory", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on location for location-based searches
        jobIndexOps.ensureIndex(new Index().on("location", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on jobType for job type filtering
        jobIndexOps.ensureIndex(new Index().on("jobType", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on experienceLevel for experience filtering
        jobIndexOps.ensureIndex(new Index().on("experienceLevel", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on isFeatured for featured job queries
        jobIndexOps.ensureIndex(new Index().on("isFeatured", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Index on isRemote for remote job filtering
        jobIndexOps.ensureIndex(new Index().on("isRemote", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on createdAt for sorting by posting date
        jobIndexOps.ensureIndex(new Index().on("createdAt", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Index on applicationDeadline for deadline-based queries
        jobIndexOps.ensureIndex(new Index().on("applicationDeadline", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Compound index for active jobs by company
        jobIndexOps.ensureIndex(new Index()
                .on("companyId", org.springframework.data.domain.Sort.Direction.ASC)
                .on("isActive", org.springframework.data.domain.Sort.Direction.ASC)
                .on("createdAt", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Compound index for job search (active, category, location)
        jobIndexOps.ensureIndex(new Index()
                .on("isActive", org.springframework.data.domain.Sort.Direction.ASC)
                .on("jobCategory", org.springframework.data.domain.Sort.Direction.ASC)
                .on("location", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Compound index for salary range queries
        jobIndexOps.ensureIndex(new Index()
                .on("isActive", org.springframework.data.domain.Sort.Direction.ASC)
                .on("salaryMin", org.springframework.data.domain.Sort.Direction.ASC)
                .on("salaryMax", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Text index for full-text search on title, description, requirements
        TextIndexDefinition textIndex = TextIndexDefinition.builder()
                .onField("title")
                .onField("description")
                .onField("requirements")
                .onField("responsibilities")
                .build();
        jobIndexOps.ensureIndex(textIndex);
    }

    private void createCompanyIndexes() {
        IndexOperations companyIndexOps = mongoTemplate.indexOps("companies");
        
        // Index on userId for user-company relationship
        companyIndexOps.ensureIndex(new Index().on("userId", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on name for company name searches
        companyIndexOps.ensureIndex(new Index().on("name", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on industry for industry filtering
        companyIndexOps.ensureIndex(new Index().on("industry", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on isVerified for verified company filtering
        companyIndexOps.ensureIndex(new Index().on("isVerified", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Index on isFeatured for featured companies
        companyIndexOps.ensureIndex(new Index().on("isFeatured", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Text index for company search
        TextIndexDefinition textIndex = TextIndexDefinition.builder()
                .onField("name")
                .onField("description")
                .build();
        companyIndexOps.ensureIndex(textIndex);
    }

    private void createUserProfileIndexes() {
        IndexOperations profileIndexOps = mongoTemplate.indexOps("user_profiles");
        
        // Index on userId for user-profile relationship
        profileIndexOps.ensureIndex(new Index().on("userId", org.springframework.data.domain.Sort.Direction.ASC).unique());
        
        // Index on matchingEnabled for matching queries
        profileIndexOps.ensureIndex(new Index().on("matchingEnabled", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on isProfileComplete for complete profile filtering
        profileIndexOps.ensureIndex(new Index().on("isProfileComplete", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on experienceYears for experience-based matching
        profileIndexOps.ensureIndex(new Index().on("experienceYears", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on expectedSalary for salary-based matching
        profileIndexOps.ensureIndex(new Index().on("expectedSalary", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on skills for skill-based matching
        profileIndexOps.ensureIndex(new Index().on("skills", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Compound index for matching criteria
        profileIndexOps.ensureIndex(new Index()
                .on("matchingEnabled", org.springframework.data.domain.Sort.Direction.ASC)
                .on("experienceYears", org.springframework.data.domain.Sort.Direction.ASC)
                .on("expectedSalary", org.springframework.data.domain.Sort.Direction.ASC));
    }

    private void createJobApplicationIndexes() {
        IndexOperations appIndexOps = mongoTemplate.indexOps("job_applications");
        
        // Index on userId for user's applications
        appIndexOps.ensureIndex(new Index().on("userId", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on jobId for job's applications
        appIndexOps.ensureIndex(new Index().on("jobId", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on status for status-based filtering
        appIndexOps.ensureIndex(new Index().on("status", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on appliedAt for sorting by application date
        appIndexOps.ensureIndex(new Index().on("appliedAt", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Compound unique index to prevent duplicate applications
        appIndexOps.ensureIndex(new Index()
                .on("userId", org.springframework.data.domain.Sort.Direction.ASC)
                .on("jobId", org.springframework.data.domain.Sort.Direction.ASC)
                .unique());
        
        // Compound index for job applications by status
        appIndexOps.ensureIndex(new Index()
                .on("jobId", org.springframework.data.domain.Sort.Direction.ASC)
                .on("status", org.springframework.data.domain.Sort.Direction.ASC)
                .on("appliedAt", org.springframework.data.domain.Sort.Direction.DESC));
    }

    private void createSubscriptionIndexes() {
        IndexOperations subIndexOps = mongoTemplate.indexOps("subscriptions");
        
        // Index on userId for user's subscriptions
        subIndexOps.ensureIndex(new Index().on("userId", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on isActive for active subscription queries
        subIndexOps.ensureIndex(new Index().on("isActive", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on plan for plan-based queries
        subIndexOps.ensureIndex(new Index().on("plan", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on endDate for expiration checks
        subIndexOps.ensureIndex(new Index().on("endDate", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on createdAt for subscription analytics
        subIndexOps.ensureIndex(new Index().on("createdAt", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Compound index for active subscriptions by user
        subIndexOps.ensureIndex(new Index()
                .on("userId", org.springframework.data.domain.Sort.Direction.ASC)
                .on("isActive", org.springframework.data.domain.Sort.Direction.ASC)
                .on("endDate", org.springframework.data.domain.Sort.Direction.DESC));
    }

    private void createSkillIndexes() {
        IndexOperations skillIndexOps = mongoTemplate.indexOps("skills");
        
        // Index on name for skill name searches
        skillIndexOps.ensureIndex(new Index().on("name", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on category for skill category filtering
        skillIndexOps.ensureIndex(new Index().on("category", org.springframework.data.domain.Sort.Direction.ASC));
        
        // Index on usageCount for popular skills
        skillIndexOps.ensureIndex(new Index().on("usageCount", org.springframework.data.domain.Sort.Direction.DESC));
        
        // Text index for skill search
        TextIndexDefinition textIndex = TextIndexDefinition.builder()
                .onField("name")
                .onField("description")
                .build();
        skillIndexOps.ensureIndex(textIndex);
    }
}
