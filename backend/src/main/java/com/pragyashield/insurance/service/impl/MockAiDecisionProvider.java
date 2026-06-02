package com.pragyashield.insurance.service.impl;

import com.pragyashield.insurance.dto.AiDecisionResponse;
import com.pragyashield.insurance.dto.ClaimTriageRequest;
import com.pragyashield.insurance.dto.UnderwritingRequest;
import com.pragyashield.insurance.dto.UnderwritingResponse;
import com.pragyashield.insurance.model.AiDecision;
import com.pragyashield.insurance.model.RiskBand;
import com.pragyashield.insurance.service.AiDecisionProvider;
import com.pragyashield.insurance.service.AuditLedgerService;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MockAiDecisionProvider implements AiDecisionProvider {
    private final AuditLedgerService auditLedger;

    public MockAiDecisionProvider(AuditLedgerService auditLedger) {
        this.auditLedger = auditLedger;
    }

    @Override
    public AiDecisionResponse triageClaim(ClaimTriageRequest request) {
        int score = 20;
        List<String> reasons = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (request.claimAmount() > 150_000) { score += 25; reasons.add("Claim amount is above standard fast-track threshold."); }
        if (request.previousClaims() > 1) { score += 20; reasons.add("Customer has multiple previous claims."); }
        if (!request.networkProvider()) { score += 15; reasons.add("Provider is outside preferred network."); }
        if (!request.documentComplete()) { score += 18; reasons.add("Mandatory documents are incomplete."); }
        if (request.customerTenureMonths() < 6) { score += 12; reasons.add("Policy tenure is below six months."); }
        if (request.extractedDocumentSignals() != null && request.extractedDocumentSignals().contains("DUPLICATE_BILL_HASH")) {
            score += 25; reasons.add("Duplicate bill hash signal detected.");
        }

        score = Math.min(score, 99);
        RiskBand band = score >= 85 ? RiskBand.CRITICAL : score >= 60 ? RiskBand.HIGH : score >= 40 ? RiskBand.MEDIUM : RiskBand.LOW;
        AiDecision decision = switch (band) {
            case LOW -> AiDecision.AUTO_APPROVE;
            case MEDIUM -> request.documentComplete() ? AiDecision.MANUAL_REVIEW : AiDecision.REQUEST_DOCUMENTS;
            case HIGH, CRITICAL -> AiDecision.MANUAL_REVIEW;
        };

        if (reasons.isEmpty()) reasons.add("Claim is consistent with policy, provider, and historical payment patterns.");
        actions.add(decision == AiDecision.AUTO_APPROVE ? "Trigger settlement workflow." : "Route claim to human reviewer with reason codes.");
        actions.add("Persist explainability, model confidence, and reviewer outcome in audit ledger.");
        actions.add("Mask PII before sending any payload to external AI provider.");

        int confidence = Math.max(72, 96 - Math.abs(45 - score));
        String auditRef = auditLedger.record("AI_CLAIM_TRIAGE", request.claimNumber(), "riskScore=" + score + ", decision=" + decision);

        return new AiDecisionResponse(request.claimNumber(), score, band, confidence, decision, reasons, actions, auditRef, Instant.now());
    }

    @Override
    public UnderwritingResponse evaluateUnderwriting(UnderwritingRequest request) {
        int risk = 25;
        List<String> reasons = new ArrayList<>();
        if (request.age() > 45) { risk += 15; reasons.add("Applicant age increases underwriting risk band."); }
        if (request.smoker()) { risk += 20; reasons.add("Smoker disclosure requires medical underwriting."); }
        if (request.previousClaims() > 0) { risk += 10; reasons.add("Previous claim history found."); }
        if (request.coverAmount() > request.annualIncome() * 12) { risk += 15; reasons.add("Cover-to-income ratio is above preferred threshold."); }
        risk = Math.min(risk, 95);
        int affordability = (int) Math.max(35, Math.min(95, 100 - ((request.coverAmount() / Math.max(request.annualIncome(), 1)) * 2)));
        double predictedPremium = Math.round((request.coverAmount() * (0.0025 + risk / 10000.0)) / 100.0) * 100.0;
        if (reasons.isEmpty()) reasons.add("Applicant profile is within preferred underwriting range.");
        String recommendation = risk > 60 ? "Approve after additional medical/financial verification." : "Approve with standard pricing and wellness add-on recommendation.";
        auditLedger.record("AI_UNDERWRITING", request.applicantName(), "riskScore=" + risk + ", premium=" + predictedPremium);
        return new UnderwritingResponse(request.applicantName(), request.productName(), predictedPremium, risk, affordability, recommendation, reasons);
    }
}
