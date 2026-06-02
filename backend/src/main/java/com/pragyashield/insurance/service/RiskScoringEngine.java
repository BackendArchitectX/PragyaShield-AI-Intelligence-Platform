package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.RiskSignal;
import com.pragyashield.insurance.model.RiskBand;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RiskScoringEngine {

    public int score(List<RiskSignal> signals, double amount, int customerTenureMonths, int previousClaims) {
        int score = 15;
        score += signals.stream().mapToInt(RiskSignal::weight).sum();
        if (amount > 150_000) score += 18;
        if (amount > 500_000) score += 22;
        if (customerTenureMonths < 6) score += 14;
        if (previousClaims > 1) score += 16;
        return Math.max(1, Math.min(score, 99));
    }

    public RiskBand riskBand(int score) {
        if (score >= 85) return RiskBand.CRITICAL;
        if (score >= 60) return RiskBand.HIGH;
        if (score >= 40) return RiskBand.MEDIUM;
        return RiskBand.LOW;
    }

    public int confidence(Claim claim) {
        int evidenceScore = claim.uploadedDocuments().size() * 8 + claim.riskSignals().size() * 10;
        int completeness = claim.documentComplete() ? 18 : -12;
        return Math.max(55, Math.min(98, 70 + evidenceScore + completeness - Math.abs(claim.riskScore() - 50) / 4));
    }
}
