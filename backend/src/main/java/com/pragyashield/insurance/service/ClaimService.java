package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.ClaimStatus;
import com.pragyashield.insurance.domain.CustomerProfile;
import com.pragyashield.insurance.domain.Policy;
import com.pragyashield.insurance.domain.RiskSignal;
import com.pragyashield.insurance.dto.ClaimResponse;
import com.pragyashield.insurance.dto.CreateClaimRequest;
import com.pragyashield.insurance.exception.BusinessRuleViolationException;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.model.AiDecision;
import com.pragyashield.insurance.model.RiskBand;
import com.pragyashield.insurance.repository.InMemoryClaimRepository;
import com.pragyashield.insurance.repository.InMemoryCustomerRepository;
import com.pragyashield.insurance.repository.InMemoryPolicyRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ClaimService {
    private final InMemoryClaimRepository claimRepository;
    private final InMemoryPolicyRepository policyRepository;
    private final InMemoryCustomerRepository customerRepository;
    private final FraudSignalService fraudSignalService;
    private final RiskScoringEngine riskScoringEngine;
    private final SettlementOrchestratorService settlementOrchestratorService;
    private final AuditLedgerService auditLedgerService;

    public ClaimService(InMemoryClaimRepository claimRepository,
                        InMemoryPolicyRepository policyRepository,
                        InMemoryCustomerRepository customerRepository,
                        FraudSignalService fraudSignalService,
                        RiskScoringEngine riskScoringEngine,
                        SettlementOrchestratorService settlementOrchestratorService,
                        AuditLedgerService auditLedgerService) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.fraudSignalService = fraudSignalService;
        this.riskScoringEngine = riskScoringEngine;
        this.settlementOrchestratorService = settlementOrchestratorService;
        this.auditLedgerService = auditLedgerService;
    }

    public List<ClaimResponse> findAll() {
        return claimRepository.findAll().stream().map(this::toClaimResponse).toList();
    }

    public List<ClaimResponse> findByCustomerId(String customerId) {
        return claimRepository.findByCustomerId(customerId).stream().map(this::toClaimResponse).toList();
    }

    public ClaimResponse findByClaimNumber(String claimNumber) {
        return claimRepository.findByClaimNumber(claimNumber)
                .map(this::toClaimResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimNumber));
    }

    public ClaimResponse create(CreateClaimRequest request) {
        Policy policy = policyRepository.findByPolicyNumber(request.policyNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + request.policyNumber()));
        CustomerProfile customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));
        if (!policy.customerId().equals(request.customerId())) {
            throw new BusinessRuleViolationException("Policy does not belong to selected customer.");
        }
        if (request.claimAmount() > policy.sumInsured()) {
            throw new BusinessRuleViolationException("Claim amount cannot exceed policy sum insured.");
        }

        int previousClaims = claimRepository.findByCustomerId(request.customerId()).size();
        List<RiskSignal> signals = fraudSignalService.detectSignals(request.claimAmount(), request.networkProvider(), request.documentComplete(),
                customer.tenureMonths(), previousClaims, request.uploadedDocuments());
        int riskScore = riskScoringEngine.score(signals, request.claimAmount(), customer.tenureMonths(), previousClaims);
        RiskBand riskBand = riskScoringEngine.riskBand(riskScore);
        AiDecision recommendation = decide(riskBand, request.documentComplete());
        String claimNumber = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String auditReference = auditLedgerService.record("CLAIM_CREATED_AI_TRIAGED", claimNumber,
                "riskScore=" + riskScore + ", riskBand=" + riskBand + ", recommendation=" + recommendation);
        Instant now = Instant.now();

        Claim claim = new Claim(claimNumber, request.policyNumber(), request.customerId(), request.claimantName(), request.policyType(),
                ClaimStatus.AI_TRIAGED, request.claimAmount(), request.description(), request.networkProvider(), request.documentComplete(),
                request.uploadedDocuments() == null ? List.of() : request.uploadedDocuments(), signals, riskScore, riskBand, recommendation, auditReference, now, now);
        claimRepository.save(claim);
        return toClaimResponse(claim);
    }

    private AiDecision decide(RiskBand riskBand, boolean documentComplete) {
        return switch (riskBand) {
            case LOW -> documentComplete ? AiDecision.AUTO_APPROVE : AiDecision.REQUEST_DOCUMENTS;
            case MEDIUM -> documentComplete ? AiDecision.MANUAL_REVIEW : AiDecision.REQUEST_DOCUMENTS;
            case HIGH, CRITICAL -> AiDecision.MANUAL_REVIEW;
        };
    }

    private ClaimResponse toClaimResponse(Claim claim) {
        List<String> explainability = fraudSignalService.explain(claim);
        List<String> reviewerActions = claim.riskScore() >= 60
                ? List.of("Verify documents manually", "Compare similar claim cluster", "Record reviewer override reason", "Notify customer with transparent status")
                : List.of("Proceed to settlement queue", "Run final policy coverage validation", "Notify customer about expected settlement date");
        return new ClaimResponse(claim, settlementOrchestratorService.buildPlan(claim), explainability, reviewerActions);
    }
}
