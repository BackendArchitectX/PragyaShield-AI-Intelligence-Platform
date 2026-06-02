package com.pragyashield.insurance.dto;

import java.util.List;

public record UnderwritingResponse(
        String applicantName,
        String productName,
        double predictedPremium,
        int riskScore,
        int affordabilityScore,
        String recommendation,
        List<String> reasonCodes
) {}
