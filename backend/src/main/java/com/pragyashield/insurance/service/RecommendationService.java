package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.CustomerProfile;
import com.pragyashield.insurance.dto.RecommendationRequest;
import com.pragyashield.insurance.dto.RecommendationResponse;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.repository.InMemoryCustomerRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {
    private final InMemoryCustomerRepository customerRepository;
    private final AuditLedgerService auditLedgerService;

    public RecommendationService(InMemoryCustomerRepository customerRepository, AuditLedgerService auditLedgerService) {
        this.customerRepository = customerRepository;
        this.auditLedgerService = auditLedgerService;
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        CustomerProfile customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));

        int budgetScore = request.monthlyBudget() >= 2500 ? 28 : request.monthlyBudget() >= 1200 ? 18 : 10;
        int loyaltyScore = Math.min(25, customer.loyaltyScore() / 4);
        int lifeStageScore = request.dependents() > 0 ? 22 : 14;
        int riskPenalty = request.hasExistingClaims() ? -12 : 6;
        int fitScore = Math.max(30, Math.min(96, 35 + budgetScore + loyaltyScore + lifeStageScore + riskPenalty));
        double premium = Math.max(650, Math.round(request.monthlyBudget() * 0.82 / 50.0) * 50.0);

        String product = switch (request.interestedPolicyType()) {
            case HEALTH -> "PragyaShield Health Protect AI Plus";
            case VEHICLE -> "PragyaShield Motor Shield AI Elite";
            case LIFE -> "PragyaShield Life Secure AI 360";
            case TRAVEL -> "PragyaShield Travel Assist AI Global";
            case HOME -> "PragyaShield Home Guard AI Prime";
        };

        Map<String, Number> scoreBreakdown = new LinkedHashMap<>();
        scoreBreakdown.put("budgetScore", budgetScore);
        scoreBreakdown.put("loyaltyScore", loyaltyScore);
        scoreBreakdown.put("lifeStageScore", lifeStageScore);
        scoreBreakdown.put("riskPenaltyOrBoost", riskPenalty);

        auditLedgerService.record("AI_POLICY_RECOMMENDATION", request.customerId(), "product=" + product + ", fitScore=" + fitScore);
        return new RecommendationResponse(request.customerId(), product, fitScore, premium,
                List.of("Matched customer budget and product eligibility", "Used consent-aware profile features", "Generated explainable next-best-offer reasoning"),
                List.of("Waiting periods", "Coverage caps", "Claim exclusions", "Premium loading conditions"), scoreBreakdown);
    }
}
