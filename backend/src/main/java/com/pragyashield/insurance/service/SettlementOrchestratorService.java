package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.ClaimStatus;
import com.pragyashield.insurance.domain.SettlementPlan;
import com.pragyashield.insurance.model.AiDecision;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SettlementOrchestratorService {

    public SettlementPlan buildPlan(Claim claim) {
        List<String> mandatoryChecks = new ArrayList<>();
        mandatoryChecks.add("Validate active policy and coverage window");
        mandatoryChecks.add("Mask PII before AI summarization");
        mandatoryChecks.add("Persist claim decision trace in audit ledger");

        List<String> paymentSteps = new ArrayList<>();
        paymentSteps.add("Create settlement task");
        paymentSteps.add("Publish CLAIM_DECISIONED event to Kafka-compatible outbox");
        paymentSteps.add("Trigger payment gateway only after reviewer or auto-approval rule passes");

        ClaimStatus recommended = switch (claim.aiRecommendation()) {
            case AUTO_APPROVE -> ClaimStatus.APPROVED;
            case REQUEST_DOCUMENTS -> ClaimStatus.DOCUMENTS_REQUIRED;
            case MANUAL_REVIEW -> ClaimStatus.UNDER_HUMAN_REVIEW;
            case REJECT -> ClaimStatus.REJECTED;
        };

        double approvedAmount = claim.aiRecommendation() == AiDecision.AUTO_APPROVE
                ? Math.min(claim.claimAmount(), claim.claimAmount() * 0.95)
                : 0.0;

        String humanReason = claim.riskScore() >= 60
                ? "Risk score is above human-in-the-loop threshold. Reviewer must verify evidence and reason codes."
                : "No human review required unless policy clause exception is detected.";

        return new SettlementPlan(claim.claimNumber(), recommended, approvedAmount, LocalDate.now().plusDays(recommended == ClaimStatus.APPROVED ? 2 : 5),
                mandatoryChecks, paymentSteps, humanReason);
    }
}
