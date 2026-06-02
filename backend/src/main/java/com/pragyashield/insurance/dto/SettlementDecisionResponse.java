package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.SettlementPlan;
import java.util.List;

public record SettlementDecisionResponse(
        SettlementPlan plan,
        List<String> orchestrationEvents,
        String auditReference
) {}
