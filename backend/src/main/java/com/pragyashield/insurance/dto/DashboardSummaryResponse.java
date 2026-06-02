package com.pragyashield.insurance.dto;

import java.util.List;
import java.util.Map;

public record DashboardSummaryResponse(
        String role,
        Map<String, Number> kpis,
        List<String> aiAlerts,
        List<String> operationalMetrics,
        List<String> architectureSignals
) {}
