package com.mynexjob.mapper;

import com.mynexjob.dto.skill.SkillDto;
import com.mynexjob.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SkillMapper {

    SkillDto toDto(Skill skill);

    Skill toEntity(SkillDto skillDto);
}
