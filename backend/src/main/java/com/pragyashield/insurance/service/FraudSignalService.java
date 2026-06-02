package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.RiskSignal;
import com.pragyashield.insurance.domain.RiskSignalType;
import com.pragyashield.insurance.domain.Severity;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FraudSignalService {

    public List<RiskSignal> detectSignals(double claimAmount,
                                          boolean networkProvider,
                                          boolean documentComplete,
                                          int tenureMonths,
                                          int previousClaims,
                                          List<String> uploadedDocuments) {
        List<RiskSignal> signals = new ArrayList<>();
        List<String> documents = uploadedDocuments == null ? List.of() : uploadedDocuments;

        if (claimAmount > 150_000) {
            signals.add(new RiskSignal(RiskSignalType.HIGH_VALUE_CLAIM, Severity.HIGH, 22,
                    "Claim amount is above fast-track threshold and needs explainable review.", "CLAIM-AMOUNT"));
        }
        if (!networkProvider) {
            signals.add(new RiskSignal(RiskSignalType.PROVIDER_ANOMALY, Severity.MEDIUM, 15,
                    "Service provider is outside preferred network.", "PROVIDER-MASTER"));
        }
        if (!documentComplete) {
            signals.add(new RiskSignal(RiskSignalType.INCOMPLETE_DOCUMENTS, Severity.MEDIUM, 18,
                    "Mandatory claim documents are incomplete.", "DOCUMENT-CHECKLIST"));
        }
        if (tenureMonths < 6) {
            signals.add(new RiskSignal(RiskSignalType.POLICY_TENURE_RISK, Severity.HIGH, 20,
                    "Claim was filed during early policy tenure.", "POLICY-STORE"));
        }
        if (previousClaims > 1) {
            signals.add(new RiskSignal(RiskSignalType.CLAIM_VELOCITY_SPIKE, Severity.HIGH, 24,
                    "Multiple claims detected inside customer history window.", "CLAIM-VELOCITY-COUNTER"));
        }
        boolean duplicateHash = documents.stream().map(String::toLowerCase).anyMatch(name -> name.contains("duplicate") || name.contains("copy"));
        if (duplicateHash) {
            signals.add(new RiskSignal(RiskSignalType.DUPLICATE_DOCUMENT_HASH, Severity.CRITICAL, 30,
                    "Document fingerprint resembles a previously submitted bill.", "VECTOR-DOC-HASH"));
        }
        if (signals.isEmpty()) {
            signals.add(new RiskSignal(RiskSignalType.PAYMENT_PATTERN_RISK, Severity.LOW, 5,
                    "No material fraud signal found from current deterministic rules.", "PAYMENT-STREAM"));
        }
        return signals;
    }

    public List<String> explain(Claim claim) {
        return claim.riskSignals().stream()
                .map(signal -> signal.type() + " [" + signal.severity() + "]: " + signal.explanation())
                .toList();
    }
}
