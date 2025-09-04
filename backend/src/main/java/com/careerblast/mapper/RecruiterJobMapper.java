package com.careerblast.mapper;

import com.careerblast.dto.job.RecruiterJobDto;
import com.careerblast.dto.skill.SkillDto;
import com.careerblast.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RecruiterJobMapper {

    @Mapping(target = "requiredSkills", expression = "java(mapSkillsToDto(job.getRequiredSkills()))")
    RecruiterJobDto toDto(Job job);

    Job toEntity(RecruiterJobDto jobDto);

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
