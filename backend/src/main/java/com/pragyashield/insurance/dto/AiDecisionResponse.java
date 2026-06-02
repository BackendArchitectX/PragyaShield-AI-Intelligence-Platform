package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.model.AiDecision;
import com.pragyashield.insurance.model.RiskBand;
import java.time.Instant;
import java.util.List;

public record AiDecisionResponse(
        String claimNumber,
        int riskScore,
        RiskBand riskBand,
        int confidence,
        AiDecision recommendedDecision,
        List<String> reasonCodes,
        List<String> nextBestActions,
        String auditReference,
        Instant decidedAt
) {}
