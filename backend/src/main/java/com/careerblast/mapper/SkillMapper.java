package com.careerblast.mapper;

import com.careerblast.dto.skill.SkillDto;
import com.careerblast.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SkillMapper {

    SkillDto toDto(Skill skill);

    Skill toEntity(SkillDto skillDto);
}
