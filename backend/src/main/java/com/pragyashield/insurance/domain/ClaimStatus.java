package com.pragyashield.insurance.domain;

public enum ClaimStatus {
    SUBMITTED,
    AI_TRIAGED,
    DOCUMENTS_REQUIRED,
    UNDER_HUMAN_REVIEW,
    APPROVED,
    REJECTED,
    SETTLED
}
