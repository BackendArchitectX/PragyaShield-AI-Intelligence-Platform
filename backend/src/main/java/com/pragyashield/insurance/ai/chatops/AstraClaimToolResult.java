package com.pragyashield.insurance.ai.chatops;

import java.util.Map;

public record AstraClaimToolResult(
        String toolName,
        String status,
        int latencyMs,
        String outputSummary,
        Map<String, Object> payload
) {}
