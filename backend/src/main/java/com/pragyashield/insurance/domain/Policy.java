package com.pragyashield.insurance.domain;

import java.time.LocalDate;
import java.util.List;

public record Policy(
        String policyNumber,
        String customerId,
        PolicyType type,
        PolicyStatus status,
        String productName,
        double sumInsured,
        double premiumAmount,
        LocalDate startDate,
        LocalDate endDate,
        List<String> riders,
        List<String> exclusions,
        int renewalPropensityScore,
        int affordabilityScore
) {}
