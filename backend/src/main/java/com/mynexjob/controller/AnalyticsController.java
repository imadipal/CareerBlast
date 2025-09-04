package com.mynexjob.controller;

import com.mynexjob.dto.analytics.MatchingStatsDto;
import com.mynexjob.dto.common.ApiResponse;
import com.mynexjob.service.MatchingAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Matching analytics and monitoring APIs")
public class AnalyticsController {

    private final MatchingAnalyticsService matchingAnalyticsService;

    @GetMapping("/matching-stats")
    @Operation(summary = "Get global matching statistics", 
               security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchingStatsDto>> getGlobalMatchingStats() {
        MatchingStatsDto stats = matchingAnalyticsService.getGlobalMatchingStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get matching metrics for monitoring", 
               security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMatchingMetrics() {
        Map<String, Object> metrics = matchingAnalyticsService.getMatchingMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/application-status-breakdown")
    @Operation(summary = "Get application status breakdown", 
               security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getApplicationStatusBreakdown() {
        Map<String, Long> breakdown = matchingAnalyticsService.getApplicationStatusBreakdown();
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }
}
