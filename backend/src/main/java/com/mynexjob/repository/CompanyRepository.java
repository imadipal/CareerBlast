package com.mynexjob.repository;

import com.mynexjob.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByUserId(String userId);

    Page<Company> findByIsVerifiedTrue(Pageable pageable);

    Page<Company> findByIsFeaturedTrue(Pageable pageable);

    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'industry': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Company> searchCompanies(String keyword, Pageable pageable);

    Page<Company> findByIndustry(String industry, Pageable pageable);

    @Query("{ 'headquarters': { $regex: ?0, $options: 'i' } }")
    Page<Company> findByLocation(String location, Pageable pageable);

    @Query(value = "{}", fields = "{ 'industry': 1 }")
    List<String> findAllIndustries();

    long countByIsVerifiedTrue();

    boolean existsByName(String name);

    @Query(value = "{}", sort = "{ 'jobIds': -1 }")
    List<Company> findTopCompaniesByJobCount(Pageable pageable);
}
