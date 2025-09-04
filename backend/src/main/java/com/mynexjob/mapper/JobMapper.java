package com.mynexjob.mapper;

import com.mynexjob.dto.job.JobDto;
import com.mynexjob.dto.skill.SkillDto;
import com.mynexjob.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JobMapper {

    @Mapping(target = "isSaved", ignore = true)
    @Mapping(target = "hasApplied", ignore = true)
    @Mapping(target = "requiredSkills", expression = "java(mapSkillsToDto(job.getRequiredSkills()))")
    JobDto toDto(Job job);

    Job toEntity(JobDto jobDto);

    // Helper method for skill mapping
    default List<SkillDto> mapSkillsToDto(List<String> skills) {
        if (skills == null) return null;
        return skills.stream()
                .map(skillName -> SkillDto.builder()
                        .name(skillName)
                        .build())
                .collect(Collectors.toList());
    }
}
