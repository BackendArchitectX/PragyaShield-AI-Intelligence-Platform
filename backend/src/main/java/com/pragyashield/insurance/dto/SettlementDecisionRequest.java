package com.pragyashield.insurance.dto;

import jakarta.validation.constraints.NotBlank;

public record SettlementDecisionRequest(
        @NotBlank String claimNumber,
        boolean reviewerApproved,
        String reviewerComment
) {}
