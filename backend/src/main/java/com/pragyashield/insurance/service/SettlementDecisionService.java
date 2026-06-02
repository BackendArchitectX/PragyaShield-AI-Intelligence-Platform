package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.SettlementPlan;
import com.pragyashield.insurance.dto.SettlementDecisionRequest;
import com.pragyashield.insurance.dto.SettlementDecisionResponse;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.repository.InMemoryClaimRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SettlementDecisionService {
    private final InMemoryClaimRepository claimRepository;
    private final SettlementOrchestratorService settlementOrchestratorService;
    private final AuditLedgerService auditLedgerService;

    public SettlementDecisionService(InMemoryClaimRepository claimRepository,
                                     SettlementOrchestratorService settlementOrchestratorService,
                                     AuditLedgerService auditLedgerService) {
        this.claimRepository = claimRepository;
        this.settlementOrchestratorService = settlementOrchestratorService;
        this.auditLedgerService = auditLedgerService;
    }

    public SettlementDecisionResponse decide(SettlementDecisionRequest request) {
        Claim claim = claimRepository.findByClaimNumber(request.claimNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + request.claimNumber()));
        SettlementPlan plan = settlementOrchestratorService.buildPlan(claim);
        String decision = request.reviewerApproved() ? "REVIEWER_APPROVED" : "REVIEWER_REJECTED_OR_NEEDS_MORE_INFO";
        String auditReference = auditLedgerService.record("SETTLEMENT_REVIEWER_DECISION", request.claimNumber(),
                "decision=" + decision + ", comment=" + sanitize(request.reviewerComment()));
        return new SettlementDecisionResponse(plan,
                List.of("CLAIM_REVIEW_COMPLETED", "SETTLEMENT_PLAN_CREATED", "CUSTOMER_NOTIFICATION_READY", "AUDIT_LEDGER_WRITTEN"), auditReference);
    }

    private String sanitize(String value) {
        if (value == null || value.isBlank()) return "NA";
        return value.replaceAll("[\r\n]", " ").trim();
    }
}
