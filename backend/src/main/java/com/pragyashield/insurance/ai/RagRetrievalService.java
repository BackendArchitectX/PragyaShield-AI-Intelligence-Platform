package com.pragyashield.insurance.ai;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RagRetrievalService {
    private final List<VectorDocument> documents = List.of(
            new VectorDocument("kb-claim-001", "Claim triage policy", "Claims are triaged using policy coverage, missing documents, provider network, duplicate document hash, claim velocity, SLA age and human-in-the-loop threshold.", "CLAIM_PLAYBOOK", Map.of("domain", "claims"), 0.0),
            new VectorDocument("kb-fraud-001", "Fraud signal graph", "Fraud graph connects claim, policy, customer, provider, duplicate bill hash, geo mismatch, claim velocity and historical settlement anomaly nodes.", "FRAUD_GRAPH", Map.of("domain", "fraud"), 0.0),
            new VectorDocument("kb-underwriting-001", "Underwriting rules", "Underwriting evaluates age band, smoker flag, medical disclosure, cover-to-income ratio, existing claims, affordability score and premium loading reasons.", "UW_RULES", Map.of("domain", "underwriting"), 0.0),
            new VectorDocument("kb-governance-001", "AI governance", "AI governance records prompt version, retrieved context, PII redaction status, model confidence, manual override rate, model drift index, reviewer outcome and audit reference.", "AI_GOVERNANCE", Map.of("domain", "governance"), 0.0),
            new VectorDocument("kb-ops-001", "Production AI operations", "Production AI path uses Redis response cache, circuit breaker fallback, Kafka outbox replay, timeout budget, p95 latency, SLO burn-rate and model monitoring.", "OPS_RUNBOOK", Map.of("domain", "operations"), 0.0)
    );

    public List<VectorDocument> retrieve(String query, int limit) {
        String normalized = query == null ? "" : query.toLowerCase(Locale.ROOT);
        return documents.stream()
                .map(doc -> withScore(doc, normalized))
                .sorted(Comparator.comparing(VectorDocument::similarityScore).reversed())
                .limit(Math.max(1, limit))
                .toList();
    }

    private VectorDocument withScore(VectorDocument doc, String query) {
        double score = 0.12;
        String haystack = (doc.title() + " " + doc.content() + " " + doc.metadata()).toLowerCase(Locale.ROOT);
        for (String token : query.split("\s+")) {
            if (token.length() > 3 && haystack.contains(token)) {
                score += 0.17;
            }
        }
        score = Math.min(0.96, score);
        return new VectorDocument(doc.id(), doc.title(), doc.content(), doc.source(), doc.metadata(), score);
    }
}
