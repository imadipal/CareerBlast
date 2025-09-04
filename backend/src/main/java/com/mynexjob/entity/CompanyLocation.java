package com.mynexjob.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "company_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyLocation extends BaseEntity {

    @Indexed
    private String companyId; // Reference to Company document

    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    @Builder.Default
    private Boolean isHeadquarters = false;

    private String phone;
    private String email;
}
