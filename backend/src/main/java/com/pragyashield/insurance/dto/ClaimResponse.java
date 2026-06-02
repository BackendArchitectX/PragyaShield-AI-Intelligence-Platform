package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.SettlementPlan;
import java.util.List;

public record ClaimResponse(
        Claim claim,
        SettlementPlan settlementPlan,
        List<String> explainability,
        List<String> reviewerActions
) {}
