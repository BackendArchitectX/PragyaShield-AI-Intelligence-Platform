package com.pragyashield.insurance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record ClaimTriageRequest(
        @NotBlank String claimNumber,
        @NotBlank String customerName,
        @NotBlank String policyType,
        @Positive double claimAmount,
        int customerTenureMonths,
        int previousClaims,
        boolean networkProvider,
        boolean documentComplete,
        List<String> extractedDocumentSignals
) {}
