package com.pragyashield.insurance.domain;

import java.time.LocalDate;
import java.util.List;

public record CustomerProfile(
        String customerId,
        String fullName,
        String email,
        String mobile,
        int age,
        String city,
        int tenureMonths,
        int loyaltyScore,
        List<String> consentScopes,
        LocalDate joinedOn
) {}
