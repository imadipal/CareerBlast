package com.mynexjob.mapper;

import com.mynexjob.dto.company.CompanyDto;
import com.mynexjob.entity.Company;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompanyMapper {

    @Mapping(target = "jobsCount", expression = "java(company.getJobs() != null ? (long) company.getJobs().size() : 0L)")
    CompanyDto toDto(Company company);

    Company toEntity(CompanyDto companyDto);
}
