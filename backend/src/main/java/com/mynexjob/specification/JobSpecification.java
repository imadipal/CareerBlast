package com.mynexjob.specification;

import com.mynexjob.dto.job.JobSearchRequest;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Query withCriteria(JobSearchRequest searchRequest) {
        List<Criteria> criteriaList = new ArrayList<>();

        // Always filter active jobs
        criteriaList.add(Criteria.where("isActive").is(true));

        // Keyword search
        if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
            String keyword = searchRequest.getKeyword();
            Criteria keywordCriteria = new Criteria().orOperator(
                Criteria.where("title").regex(keyword, "i"),
                Criteria.where("description").regex(keyword, "i")
            );
            criteriaList.add(keywordCriteria);
        }

        // Location filter
        if (searchRequest.getLocation() != null && !searchRequest.getLocation().trim().isEmpty()) {
            criteriaList.add(Criteria.where("location").regex(searchRequest.getLocation(), "i"));
        }

        // Job types filter
        if (searchRequest.getJobTypes() != null && !searchRequest.getJobTypes().isEmpty()) {
            criteriaList.add(Criteria.where("jobType").in(searchRequest.getJobTypes()));
        }

        // Company filter
        if (searchRequest.getCompanyIds() != null && !searchRequest.getCompanyIds().isEmpty()) {
            criteriaList.add(Criteria.where("companyId").in(searchRequest.getCompanyIds()));
        }

        // Skills filter
        if (searchRequest.getSkillIds() != null && !searchRequest.getSkillIds().isEmpty()) {
            criteriaList.add(Criteria.where("requiredSkills").in(searchRequest.getSkillIds()));
        }

        // Salary range filter
        if (searchRequest.getSalaryMin() != null) {
            criteriaList.add(Criteria.where("salaryMax").gte(searchRequest.getSalaryMin()));
        }
        if (searchRequest.getSalaryMax() != null) {
            criteriaList.add(Criteria.where("salaryMin").lte(searchRequest.getSalaryMax()));
        }

        // Experience range filter
        if (searchRequest.getExperienceMin() != null) {
            criteriaList.add(Criteria.where("experienceMax").gte(searchRequest.getExperienceMin()));
        }
        if (searchRequest.getExperienceMax() != null) {
            criteriaList.add(Criteria.where("experienceMin").lte(searchRequest.getExperienceMax()));
        }

        // Remote work filter
        if (searchRequest.getIsRemote() != null) {
            criteriaList.add(Criteria.where("isRemote").is(searchRequest.getIsRemote()));
        }

        // Hybrid work filter
        if (searchRequest.getIsHybrid() != null) {
            criteriaList.add(Criteria.where("isHybrid").is(searchRequest.getIsHybrid()));
        }

        // Featured jobs filter
        if (searchRequest.getIsFeatured() != null) {
            criteriaList.add(Criteria.where("isFeatured").is(searchRequest.getIsFeatured()));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return query;
    }
}
