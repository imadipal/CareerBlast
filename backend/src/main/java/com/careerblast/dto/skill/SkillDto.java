package com.careerblast.dto.skill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private UUID id;
    private String name;
    private String category;
    private String description;
    private Boolean isActive;
    private Long usageCount;
}
