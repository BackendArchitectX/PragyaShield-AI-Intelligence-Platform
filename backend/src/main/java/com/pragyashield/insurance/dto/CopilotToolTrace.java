package com.pragyashield.insurance.dto;

public record CopilotToolTrace(
        String toolName,
        String status,
        int latencyMs,
        String outputSummary
) {}
