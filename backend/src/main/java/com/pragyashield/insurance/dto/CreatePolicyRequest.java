package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.PolicyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record CreatePolicyRequest(
        @NotBlank String customerId,
        @NotNull PolicyType type,
        @NotBlank String productName,
        @Positive double sumInsured,
        @Positive double premiumAmount,
        List<String> riders
) {}
