package com.mynexjob.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
public class AvatarInfoResponse {
    
    private String fileName;
    private String fileKey;
    private Long fileSize;
    private String contentType;
    private String downloadUrl;
    private LocalDateTime uploadedAt;
    private Instant lastModified;
}
