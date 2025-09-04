package com.careerblast.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {

    @Indexed(unique = true)
    private String name;

    @Indexed
    private String category;

    private String description;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Long usageCount = 0L;

    public void incrementUsageCount() {
        this.usageCount++;
    }
}
