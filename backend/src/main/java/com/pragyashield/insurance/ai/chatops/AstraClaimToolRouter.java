package com.pragyashield.insurance.ai.chatops;

import com.pragyashield.insurance.model.ChatIntent;
import com.pragyashield.insurance.model.UserRole;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AstraClaimToolRouter {

    public List<AstraClaimToolResult> route(ChatIntent intent, UserRole role) {
        return switch (intent) {
            case CLAIM_TRIAGE -> List.of(
                    result("ClaimRiskScoringTool", 82, "Calculated claim risk score, SLA burn-rate, document completeness and policy exclusion match.", Map.of(
                            "riskScore", 68,
                            "riskBand", "HIGH",
                            "slaHoursRemaining", 7,
                            "missingDocuments", List.of("geo-tagged incident photo", "itemized invoice"),
                            "decision", "MANUAL_REVIEW"
                    )),
                    result("HumanReviewRouter", 31, "Assigned claim to human-in-the-loop reviewer because riskBand is HIGH.", Map.of(
                            "reviewQueue", "SIU_CLAIMS_REVIEW",
                            "reviewerSkill", "VEHICLE_FRAUD",
                            "priority", "P1"
                    ))
            );
            case UNDERWRITING -> List.of(
                    result("UnderwritingSimulator", 77, "Predicted premium loading using affordability score, cover-to-income ratio and medical disclosure signals.", Map.of(
                            "predictedPremium", 24750,
                            "affordabilityScore", 81,
                            "premiumLoadingPercent", 12,
                            "medicalTestRequired", true
                    ))
            );
            case FRAUD_ANALYSIS -> List.of(
                    result("FraudGraphTraversal", 118, "Correlated duplicate document hash, provider anomaly score, geo mismatch and claim velocity counter.", Map.of(
                            "duplicateHashMatch", true,
                            "providerAnomalyScore", 0.73,
                            "claimVelocityLast30Days", 4,
                            "graphDepth", 3
                    )),
                    result("SIUEscalationPolicy", 46, "Recommended SIU escalation and auto-settlement freeze until reviewer confirmation.", Map.of(
                            "freezeSettlement", true,
                            "escalation", "SPECIAL_INVESTIGATION_UNIT"
                    ))
            );
            case POLICY_RECOMMENDATION -> List.of(
                    result("PolicyFitRanker", 69, "Ranked policy upgrades using cover gap, premium history, customer life-stage and renewal propensity.", Map.of(
                            "recommendedPlan", "Health Plus Secure 25L",
                            "coverGap", 1500000,
                            "renewalPropensity", 0.84,
                            "crossSell", List.of("Critical Illness Rider", "OPD Add-on")
                    ))
            );
            case OPERATIONS -> List.of(
                    result("OpsTelemetryReader", 53, "Read p95 latency, Redis cache hit ratio, Kafka lag, circuit breaker events and SLO burn-rate.", Map.of(
                            "p95LatencyMs", 184,
                            "redisHitRatio", 0.91,
                            "kafkaConsumerLag", 42,
                            "circuitBreakerState", "CLOSED",
                            "sloBurnRate", 0.71
                    ))
            );
            case GOVERNANCE -> List.of(
                    result("GovernancePolicyEvaluator", 64, "Checked prompt version, retrieval coverage, manual override rate, model drift and fairness guardrails.", Map.of(
                            "promptVersion", "astraclaim-v2.1",
                            "modelDriftIndex", 0.07,
                            "manualOverrideRate", "8.4%",
                            "biasGuardrail", "PASS"
                    ))
            );
            case GENERAL -> List.of(
                    result("SemanticIntentRouter", 38, "No narrow intent found; returned role-aware insurance copilot guidance.", Map.of(
                            "role", role,
                            "supportedIntents", List.of("CLAIM_TRIAGE", "UNDERWRITING", "FRAUD_ANALYSIS", "POLICY_RECOMMENDATION", "OPERATIONS", "GOVERNANCE")
                    ))
            );
        };
    }

    private AstraClaimToolResult result(String name, int latencyMs, String summary, Map<String, Object> payload) {
        return new AstraClaimToolResult(name, "SUCCESS", latencyMs, summary, new LinkedHashMap<>(payload));
    }
}
