package com.mynexjob.controller;

import com.mynexjob.dto.common.ApiResponse;
import com.mynexjob.dto.profile.CreateProfileRequest;
import com.mynexjob.dto.profile.UserProfileDto;
import com.mynexjob.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "User profile management APIs")
@PreAuthorize("hasRole('USER')")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    @Operation(summary = "Get user profile", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(Authentication authentication) {
        UserProfileDto profile = userProfileService.getUserProfile(authentication.getName());
        
        if (profile == null) {
            return ResponseEntity.ok(ApiResponse.success("Profile not found", null));
        }
        
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PostMapping
    @Operation(summary = "Create or update user profile", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<UserProfileDto>> createOrUpdateProfile(
            @Valid @RequestBody CreateProfileRequest request,
            Authentication authentication) {
        
        UserProfileDto profile = userProfileService.createOrUpdateProfile(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/completion-status")
    @Operation(summary = "Check profile completion status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Boolean>> isProfileComplete(Authentication authentication) {
        boolean isComplete = userProfileService.isProfileComplete(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile completion status", isComplete));
    }

    @GetMapping("/matching-status")
    @Operation(summary = "Check if matching is enabled", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Boolean>> isMatchingEnabled(Authentication authentication) {
        boolean isEnabled = userProfileService.isMatchingEnabled(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Matching status", isEnabled));
    }

    @PostMapping("/enable-matching")
    @Operation(summary = "Enable job matching", 
               description = "Enable intelligent job matching for the user profile",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> enableMatching(Authentication authentication) {
        userProfileService.enableMatching(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Matching enabled successfully", 
                "You will now receive intelligent job recommendations"));
    }

    @PostMapping("/disable-matching")
    @Operation(summary = "Disable job matching", 
               description = "Disable intelligent job matching for the user profile",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> disableMatching(Authentication authentication) {
        userProfileService.disableMatching(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Matching disabled successfully", 
                "You will no longer receive job recommendations"));
    }
}
