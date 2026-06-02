package com.pragyashield.insurance.domain;

import java.time.LocalDate;
import java.util.List;

public record SettlementPlan(
        String claimNumber,
        ClaimStatus recommendedStatus,
        double approvedAmount,
        LocalDate expectedSettlementDate,
        List<String> mandatoryChecks,
        List<String> paymentOrchestrationSteps,
        String humanReviewReason
) {}
