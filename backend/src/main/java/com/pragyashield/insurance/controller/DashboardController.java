package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.DashboardSummaryResponse;
import com.pragyashield.insurance.model.UserRole;
import com.pragyashield.insurance.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{role}")
    public DashboardSummaryResponse dashboard(@PathVariable UserRole role) {
        return dashboardService.summary(role);
    }
}
