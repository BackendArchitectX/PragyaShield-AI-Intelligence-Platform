package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.PolicyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecommendationRequest(
        @NotBlank String customerId,
        @NotNull PolicyType interestedPolicyType,
        double monthlyBudget,
        int dependents,
        boolean hasExistingClaims
) {}
