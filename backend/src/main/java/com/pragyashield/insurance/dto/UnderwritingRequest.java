package com.pragyashield.insurance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UnderwritingRequest(
        @NotBlank String applicantName,
        @NotBlank String productName,
        int age,
        @Positive double coverAmount,
        double annualIncome,
        boolean smoker,
        int existingPolicies,
        int previousClaims
) {}
