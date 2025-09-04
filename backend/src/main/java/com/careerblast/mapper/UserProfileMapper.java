package com.careerblast.mapper;

import com.careerblast.dto.profile.*;
import com.careerblast.dto.skill.SkillDto;
import com.careerblast.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserProfileMapper {

    @Mapping(target = "skills", expression = "java(mapSkillsToDto(userProfile.getSkills()))")
    UserProfileDto toDto(UserProfile userProfile);

    @Mapping(target = "skills", expression = "java(mapSkillsToString(userProfileDto.getSkills()))")
    UserProfile toEntity(UserProfileDto userProfileDto);

    WorkExperienceDto toDto(WorkExperience workExperience);

    WorkExperience toEntity(WorkExperienceDto workExperienceDto);

    EducationDto toDto(Education education);

    Education toEntity(EducationDto educationDto);

    CertificationDto toDto(Certification certification);

    Certification toEntity(CertificationDto certificationDto);

    // Helper methods for skill mapping
    default List<SkillDto> mapSkillsToDto(List<String> skills) {
        if (skills == null) return null;
        return skills.stream()
                .map(skillName -> SkillDto.builder()
                        .name(skillName)
                        .build())
                .collect(Collectors.toList());
    }

    default List<String> mapSkillsToString(List<SkillDto> skills) {
        if (skills == null) return null;
        return skills.stream()
                .map(SkillDto::getName)
                .collect(Collectors.toList());
    }
}
