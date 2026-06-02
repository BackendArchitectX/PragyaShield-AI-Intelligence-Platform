package com.pragyashield.insurance.repository;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.ClaimStatus;
import com.pragyashield.insurance.domain.PolicyType;
import com.pragyashield.insurance.domain.RiskSignal;
import com.pragyashield.insurance.domain.RiskSignalType;
import com.pragyashield.insurance.domain.Severity;
import com.pragyashield.insurance.model.AiDecision;
import com.pragyashield.insurance.model.RiskBand;
import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryClaimRepository {
    private final ConcurrentMap<String, Claim> claims = new ConcurrentHashMap<>();

    @PostConstruct
    void seed() {
        Instant now = Instant.now();
        save(new Claim("CLM-2026-0001", "POL-HEALTH-1001", "CUST-1001", "Rajesh Kumar Sharma", PolicyType.HEALTH,
                ClaimStatus.AI_TRIAGED, 56_000, "Cashless hospitalization claim for appendicitis", true, true,
                List.of("hospital_bill.pdf", "discharge_summary.pdf"),
                List.of(new RiskSignal(RiskSignalType.PAYMENT_PATTERN_RISK, Severity.LOW, 8, "Premiums are paid on time; low settlement risk.", "PAYMENT-STREAM")),
                31, RiskBand.LOW, AiDecision.AUTO_APPROVE, "AUD-SEED-1001", now.minusSeconds(7200), now.minusSeconds(3600)));
        save(new Claim("CLM-2026-0002", "POL-VEH-2002", "CUST-1002", "Amit Patel", PolicyType.VEHICLE,
                ClaimStatus.UNDER_HUMAN_REVIEW, 185_000, "High-value bumper and engine repair claim after short policy tenure", false, false,
                List.of("repair_estimate.jpg"),
                List.of(
                        new RiskSignal(RiskSignalType.POLICY_TENURE_RISK, Severity.HIGH, 22, "Policy tenure is below six months.", "POLICY-STORE"),
                        new RiskSignal(RiskSignalType.INCOMPLETE_DOCUMENTS, Severity.MEDIUM, 18, "FIR and final invoice are missing.", "DOCUMENT-AI"),
                        new RiskSignal(RiskSignalType.HIGH_VALUE_CLAIM, Severity.HIGH, 25, "Claim amount is above fast-track threshold.", "CLAIM-RULES")
                ), 83, RiskBand.HIGH, AiDecision.MANUAL_REVIEW, "AUD-SEED-1002", now.minusSeconds(5400), now.minusSeconds(900)));
    }

    public Claim save(Claim claim) {
        claims.put(claim.claimNumber(), claim);
        return claim;
    }

    public Optional<Claim> findByClaimNumber(String claimNumber) {
        return Optional.ofNullable(claims.get(claimNumber));
    }

    public List<Claim> findByCustomerId(String customerId) {
        return claims.values().stream()
                .filter(claim -> claim.customerId().equals(customerId))
                .sorted(Comparator.comparing(Claim::createdAt).reversed())
                .toList();
    }

    public List<Claim> findAll() {
        return claims.values().stream()
                .sorted(Comparator.comparing(Claim::createdAt).reversed())
                .toList();
    }

    public long countByStatus(ClaimStatus status) {
        return claims.values().stream().filter(claim -> claim.status() == status).count();
    }
}
