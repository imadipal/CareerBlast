package com.mynexjob.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class AvatarUploadCompleteRequest {
    
    @NotBlank(message = "File key is required")
    @Size(max = 500, message = "File key must not exceed 500 characters")
    private String fileKey;
    
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must not exceed 255 characters")
    private String fileName;
    
    @Size(max = 100, message = "Content type must not exceed 100 characters")
    private String contentType;
}
