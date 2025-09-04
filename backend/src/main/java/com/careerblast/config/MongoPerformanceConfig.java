package com.careerblast.config;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.PostConstruct;

@Component("mongoPerformanceMonitor")
@RequiredArgsConstructor
@Slf4j
public class MongoPerformanceConfig {

    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void checkPerformance() {
        try {
            // Check if MongoDB is accessible
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            log.info("MongoDB connection successful");

            // Check critical indexes exist
            boolean criticalIndexesExist = checkCriticalIndexes();

            if (criticalIndexesExist) {
                log.info("Critical MongoDB indexes are present");
            } else {
                log.warn("Some critical MongoDB indexes are missing - performance may be impacted");
            }

        } catch (Exception e) {
            log.error("MongoDB connection or index check failed: {}", e.getMessage());
        }
    }

    private boolean checkCriticalIndexes() {
        try {
            // Check for critical indexes that are essential for performance
            String[] criticalCollections = {"users", "jobs", "job_applications"};

            for (String collection : criticalCollections) {
                var indexOps = mongoTemplate.indexOps(collection);
                var indexes = indexOps.getIndexInfo();

                // Each collection should have more than just the default _id index
                if (indexes.size() <= 1) {
                    log.warn("Collection '{}' is missing performance indexes", collection);
                    return false;
                }
            }

            return true;

        } catch (Exception e) {
            log.error("Error checking critical indexes: {}", e.getMessage());
            return false;
        }
    }
}
