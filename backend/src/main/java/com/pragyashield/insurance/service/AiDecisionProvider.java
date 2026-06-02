package com.pragyashield.insurance.service;

import com.pragyashield.insurance.dto.AiDecisionResponse;
import com.pragyashield.insurance.dto.ClaimTriageRequest;
import com.pragyashield.insurance.dto.UnderwritingRequest;
import com.pragyashield.insurance.dto.UnderwritingResponse;

public interface AiDecisionProvider {
    AiDecisionResponse triageClaim(ClaimTriageRequest request);
    UnderwritingResponse evaluateUnderwriting(UnderwritingRequest request);
}
