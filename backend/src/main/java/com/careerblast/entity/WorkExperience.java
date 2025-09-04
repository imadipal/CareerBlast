package com.careerblast.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;

@Document(collection = "work_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperience extends BaseEntity {

    @Indexed
    private String userProfileId; // Reference to UserProfile document

    private String companyName;
    private String position;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private Boolean isCurrent = false;

    private String location;
    private String companyUrl;
    private String achievements;
}
