package com.pragyashield.insurance.domain;

import com.pragyashield.insurance.model.AiDecision;
import com.pragyashield.insurance.model.RiskBand;
import java.time.Instant;
import java.util.List;

public record Claim(
        String claimNumber,
        String policyNumber,
        String customerId,
        String claimantName,
        PolicyType policyType,
        ClaimStatus status,
        double claimAmount,
        String description,
        boolean networkProvider,
        boolean documentComplete,
        List<String> uploadedDocuments,
        List<RiskSignal> riskSignals,
        int riskScore,
        RiskBand riskBand,
        AiDecision aiRecommendation,
        String auditReference,
        Instant createdAt,
        Instant updatedAt
) {}
