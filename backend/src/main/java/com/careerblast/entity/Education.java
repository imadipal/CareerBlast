package com.careerblast.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;

@Document(collection = "educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education extends BaseEntity {

    @Indexed
    private String userProfileId; // Reference to UserProfile document

    private String institution;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private Boolean isCurrent = false;

    private String grade;
    private String description;
    private String location;
}
