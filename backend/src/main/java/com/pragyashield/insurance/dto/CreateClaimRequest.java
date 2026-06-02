package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.PolicyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record CreateClaimRequest(
        @NotBlank String policyNumber,
        @NotBlank String customerId,
        @NotBlank String claimantName,
        @NotNull PolicyType policyType,
        @Positive double claimAmount,
        @NotBlank String description,
        boolean networkProvider,
        boolean documentComplete,
        List<String> uploadedDocuments
) {}
