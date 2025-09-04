package com.mynexjob.repository;

import com.mynexjob.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    Optional<Skill> findByNameIgnoreCase(String name);

    Page<Skill> findByIsActiveTrue(Pageable pageable);

    Page<Skill> findByCategory(String category, Pageable pageable);

    @Query("{ 'isActive': true, 'name': { $regex: ?0, $options: 'i' } }")
    Page<Skill> searchSkills(String keyword, Pageable pageable);

    @Query(value = "{ 'category': { $ne: null }, 'isActive': true }", fields = "{ 'category': 1 }")
    List<String> findAllCategories();

    @Query(value = "{ 'isActive': true }", sort = "{ 'usageCount': -1 }")
    List<Skill> findMostUsedSkills(Pageable pageable);

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    boolean existsByNameIgnoreCase(String name);

    long countByIsActiveTrue();
}
