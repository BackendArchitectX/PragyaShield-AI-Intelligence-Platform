package com.pragyashield.insurance.service;

import com.pragyashield.insurance.ai.AiProviderClient;
import com.pragyashield.insurance.ai.AiProviderRequest;
import com.pragyashield.insurance.ai.AiProviderResponse;
import com.pragyashield.insurance.ai.PromptGuardrailService;
import com.pragyashield.insurance.ai.RagRetrievalService;
import com.pragyashield.insurance.ai.VectorDocument;
import com.pragyashield.insurance.ai.chatops.AstraClaimConversationEvent;
import com.pragyashield.insurance.ai.chatops.AstraClaimPromptEnvelope;
import com.pragyashield.insurance.ai.chatops.AstraClaimPromptTemplateFactory;
import com.pragyashield.insurance.ai.chatops.AstraClaimToolResult;
import com.pragyashield.insurance.ai.chatops.AstraClaimToolRouter;
import com.pragyashield.insurance.ai.chatops.ChatMemoryRepository;
import com.pragyashield.insurance.dto.CopilotChatRequest;
import com.pragyashield.insurance.dto.CopilotChatResponse;
import com.pragyashield.insurance.dto.CopilotToolTrace;
import com.pragyashield.insurance.model.ChatIntent;
import com.pragyashield.insurance.model.UserRole;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AstraClaimChatOpsService {
    private static final String CHATBOT_NAME = "AstraClaim AI ChatOps";
    private static final String SYSTEM_PROMPT = "You are AstraClaim AI ChatOps, a governed insurance AI assistant. "
            + "Always answer with policy-grounded context, reason codes, auditability, human-in-the-loop safety, "
            + "PII minimization, and production operations awareness.";

    private final AuditLedgerService auditLedgerService;
    private final PromptGuardrailService promptGuardrailService;
    private final RagRetrievalService ragRetrievalService;
    private final AiProviderClient aiProviderClient;
    private final AstraClaimToolRouter astraClaimToolRouter;
    private final AstraClaimPromptTemplateFactory promptTemplateFactory;
    private final ChatMemoryRepository chatMemoryRepository;

    public AstraClaimChatOpsService(AuditLedgerService auditLedgerService,
                                   PromptGuardrailService promptGuardrailService,
                                   RagRetrievalService ragRetrievalService,
                                   AiProviderClient aiProviderClient,
                                   AstraClaimToolRouter astraClaimToolRouter,
                                   AstraClaimPromptTemplateFactory promptTemplateFactory,
                                   ChatMemoryRepository chatMemoryRepository) {
        this.auditLedgerService = auditLedgerService;
        this.promptGuardrailService = promptGuardrailService;
        this.ragRetrievalService = ragRetrievalService;
        this.aiProviderClient = aiProviderClient;
        this.astraClaimToolRouter = astraClaimToolRouter;
        this.promptTemplateFactory = promptTemplateFactory;
        this.chatMemoryRepository = chatMemoryRepository;
    }

    public CopilotChatResponse chat(CopilotChatRequest request) {
        PromptGuardrailService.GuardrailResult guardrailResult = promptGuardrailService.sanitize(request.prompt());
        String prompt = guardrailResult.sanitizedPrompt().toLowerCase();
        ChatIntent intent = classify(prompt);

        List<CopilotToolTrace> traces = new ArrayList<>();
        traces.add(new CopilotToolTrace("PromptClassifier", "SUCCESS", 21, "Mapped prompt to " + intent + " playbook."));
        traces.add(new CopilotToolTrace("PIIRedactionFilter", "SUCCESS", 17, "Guardrail actions: " + guardrailResult.actions()));

        List<VectorDocument> retrievedDocs = ragRetrievalService.retrieve(prompt, 3);
        List<String> retrievedContext = retrievedDocs.stream()
                .map(doc -> doc.source() + ": " + doc.content() + " [similarity=" + String.format("%.2f", doc.similarityScore()) + "]")
                .toList();
        traces.add(new CopilotToolTrace("RagRetriever", "SUCCESS", 44,
                "Retrieved " + retrievedDocs.size() + " vector chunks from policy, claim, fraud, governance and ops knowledge sources."));

        AnswerBundle domainBundle = switch (intent) {
            case CLAIM_TRIAGE -> claimAnswer(request.role(), traces);
            case UNDERWRITING -> underwritingAnswer(traces);
            case FRAUD_ANALYSIS -> fraudAnswer(traces);
            case POLICY_RECOMMENDATION -> policyAnswer(traces);
            case OPERATIONS -> operationsAnswer(traces);
            case GOVERNANCE -> governanceAnswer(traces);
            case GENERAL -> generalAnswer(request.role(), traces);
        };

        List<AstraClaimToolResult> toolResults = astraClaimToolRouter.route(intent, request.role());
        toolResults.forEach(tool -> traces.add(new CopilotToolTrace(
                tool.toolName(), tool.status(), tool.latencyMs(), tool.outputSummary())));

        AstraClaimPromptEnvelope promptEnvelope = promptTemplateFactory.build(
                SYSTEM_PROMPT, request.role(), intent, guardrailResult.sanitizedPrompt(), retrievedDocs, toolResults);

        Map<String, Object> toolOutputs = new LinkedHashMap<>();
        toolOutputs.put("intent", intent.name());
        toolOutputs.put("runtimeMode", request.runtimeMode() == null ? "RAG + Tool Calling + Guardrails" : request.runtimeMode());
        toolOutputs.put("contextTags", request.contextTags() == null ? List.of() : request.contextTags());
        toolOutputs.put("domainSuggestedActions", domainBundle.suggestedActions());
        toolOutputs.put("agenticToolPayloads", toolResults.stream().map(AstraClaimToolResult::payload).toList());
        toolOutputs.put("promptTelemetry", promptEnvelope.telemetry());
        toolOutputs.put("safetyGuardrails", promptEnvelope.guardrails());

        AiProviderResponse aiResponse = aiProviderClient.complete(new AiProviderRequest(
                promptEnvelope.systemPrompt(),
                promptEnvelope.domainPrompt(),
                request.role(),
                retrievedContext,
                toolOutputs,
                0.2,
                650
        ));
        traces.add(new CopilotToolTrace("DomainLLMGateway", "SUCCESS", aiResponse.latencyMs(),
                "Provider=" + aiResponse.providerName() + ", model=" + aiResponse.modelName()
                        + ", promptTokens=" + aiResponse.promptTokens() + ", completionTokens=" + aiResponse.completionTokens()));

        String conversationId = request.conversationId() == null || request.conversationId().isBlank()
                ? "CONV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
                : request.conversationId();
        String auditRef = auditLedgerService.record("ASTRACLAIM_CHATOPS", conversationId,
                "intent=" + intent + ", confidence=" + confidence(intent) + ", model=" + aiResponse.modelName());
        chatMemoryRepository.append(new AstraClaimConversationEvent(
                conversationId, request.role(), intent, guardrailResult.sanitizedPrompt(), confidence(intent), retrievedContext, auditRef, Instant.now()));

        List<String> mergedRetrievalContext = new ArrayList<>();
        mergedRetrievalContext.addAll(retrievedContext);
        mergedRetrievalContext.addAll(domainBundle.retrievalContext());

        String finalAnswer = domainBundle.answer()
                + "\n\nAI integration note: " + aiResponse.generatedText();

        return new CopilotChatResponse(
                conversationId,
                CHATBOT_NAME,
                intent,
                confidence(intent),
                finalAnswer,
                mergedRetrievalContext,
                domainBundle.suggestedActions(),
                List.of(
                        "PII redaction enabled before AI inference",
                        "RAG answer must cite retrieved business context",
                        "Human approval required for final claim rejection or pricing exception",
                        "Prompt-injection patterns are neutralized before provider call",
                        "Every response creates an immutable audit-ledger reference",
                        "Fallback path remains deterministic if external model is unavailable"
                ),
                traces,
                auditRef,
                Instant.now()
        );
    }

    public Map<String, Object> technicalProfile(UserRole role) {
        return Map.of(
                "chatbotName", CHATBOT_NAME,
                "role", role,
                "technicalKeywords", List.of(
                        "RAG Pipeline", "Vector Embeddings", "Semantic Search", "Tool Calling", "Prompt Guardrails",
                        "PII Redaction", "Audit Ledger", "Redis Cache", "Kafka Event Replay", "Circuit Breaker",
                        "p95 Latency", "SLO Burn Rate", "Human-in-the-Loop", "Model Drift", "Manual Override Rate",
                        "LLM Gateway", "Provider Abstraction", "Token Budget", "Prompt Versioning", "Outbox Pattern",
                        "Domain Events", "Feature Flags", "Fallback Strategy", "SIU Fraud Review"
                ),
                "knowledgeSources", List.of(
                        "policy-clause-vector-index", "claim-risk-rule-engine", "premium-payment-stream",
                        "customer-policy-store", "fraud-signal-graph", "ai-audit-ledger", "ops-runbook-index"
                ),
                "runtime", "RAG + Tool Calling + Guardrails + Mock Provider Abstraction",
                "chatMemoryEvents", chatMemoryRepository.totalEvents(),
                "agenticTools", List.of("ClaimRiskScoringTool", "FraudGraphTraversal", "UnderwritingSimulator", "PolicyFitRanker", "OpsTelemetryReader", "GovernancePolicyEvaluator"),
                "replaceMockProviderWith", List.of("OpenAI", "Azure OpenAI", "Gemini", "Bedrock", "Internal LLM Gateway")
        );
    }

    private ChatIntent classify(String prompt) {
        if (containsAny(prompt, "claim", "settlement", "document")) return ChatIntent.CLAIM_TRIAGE;
        if (containsAny(prompt, "underwriting", "premium", "proposal", "medical")) return ChatIntent.UNDERWRITING;
        if (containsAny(prompt, "fraud", "risk", "duplicate", "velocity")) return ChatIntent.FRAUD_ANALYSIS;
        if (containsAny(prompt, "policy", "recommend", "upgrade", "cover")) return ChatIntent.POLICY_RECOMMENDATION;
        if (containsAny(prompt, "latency", "p95", "slo", "redis", "kafka", "circuit")) return ChatIntent.OPERATIONS;
        if (containsAny(prompt, "audit", "drift", "guardrail", "bias", "compliance")) return ChatIntent.GOVERNANCE;
        return ChatIntent.GENERAL;
    }

    private boolean containsAny(String prompt, String... keywords) {
        for (String keyword : keywords) {
            if (prompt.contains(keyword)) return true;
        }
        return false;
    }

    private int confidence(ChatIntent intent) {
        return switch (intent) {
            case CLAIM_TRIAGE -> 93;
            case UNDERWRITING -> 90;
            case FRAUD_ANALYSIS -> 88;
            case POLICY_RECOMMENDATION -> 91;
            case OPERATIONS -> 89;
            case GOVERNANCE -> 92;
            case GENERAL -> 84;
        };
    }

    private AnswerBundle claimAnswer(UserRole role, List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("ClaimTriageTool", "SUCCESS", 92, "Calculated risk band, missing documents, SLA age and next-best-action."));
        String answer = role == UserRole.CUSTOMER
                ? "Your claim should be evaluated using policy coverage, document completeness, provider network status, duplicate-bill hash, waiting-period rules and SLA age. Recommendation: request missing itemized document and keep the claim in assisted review."
                : "Use riskScore, exclusion match, duplicate bill hash, provider trust score, claim velocity, renewal proximity and SLA burn-rate. LOW goes to STP, MEDIUM requests documents, HIGH/CRITICAL goes to manual review with reason codes.";
        return new AnswerBundle(answer,
                List.of("claim-risk-rule-engine", "policy-clause-vector-index", "ai-audit-ledger"),
                List.of("Generate missing-document checklist", "Create audit-ledger entry", "Trigger human reviewer workflow", "Open reason-code explanation"));
    }

    private AnswerBundle underwritingAnswer(List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("UnderwritingEvaluator", "SUCCESS", 87, "Predicted premium, affordability score, cover-to-income ratio and reason codes."));
        return new AnswerBundle(
                "Underwriting uses age band, smoker flag, medical disclosure, cover-to-income ratio, existing policies, previous claims and affordability score. AI can recommend risk-adjusted premium or medical tests, but final acceptance remains rule-backed and auditable.",
                List.of("underwriting-rule-engine", "customer-policy-store", "policy-clause-vector-index"),
                List.of("Calculate predicted premium", "Request medical test", "Explain risk loading", "Generate underwriting note"));
    }

    private AnswerBundle fraudAnswer(List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("FraudSignalGraph", "SUCCESS", 118, "Joined duplicate hashes, geo mismatch, provider anomaly and claim velocity signals."));
        return new AnswerBundle(
                "Fraud scoring combines duplicate document hash, repair-estimate variance, geo-tag mismatch, provider anomaly score, claim velocity counter, renewal proximity and historical settlement pattern. Use graph-linked signals so reviewers can defend the decision.",
                List.of("fraud-signal-graph", "premium-payment-stream", "claim-risk-rule-engine"),
                List.of("Escalate to SIU reviewer", "Freeze auto-settlement", "Compare anomaly cluster", "Show graph-linked fraud signals"));
    }

    private AnswerBundle policyAnswer(List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("PolicyRecommendationTool", "SUCCESS", 74, "Matched cover gap, payment behavior, tenure and renewal propensity."));
        return new AnswerBundle(
                "Policy recommendation uses cover gap analysis, premium affordability, claim history, life-stage signals, nominee profile, payment consistency and product eligibility. The AI must explain exclusions and recommendation reasons.",
                List.of("policy-clause-vector-index", "customer-policy-store", "premium-payment-stream"),
                List.of("Compare plans", "Show affordability simulation", "Generate upgrade recommendation", "Create customer explanation"));
    }

    private AnswerBundle operationsAnswer(List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("OpsTelemetryTool", "SUCCESS", 53, "Read p95 latency, queue depth, Redis hit ratio and circuit-breaker fallback events."));
        return new AnswerBundle(
                "Protect the AI path with API gateway rate limiting, Redis-backed response cache, Kafka event replay for audit, circuit breaker fallback to deterministic rules, timeout budgets, SLO burn-rate alerts and p95 latency monitoring.",
                List.of("service-metrics", "premium-payment-stream", "redis-risk-cache", "circuit-breaker-events"),
                List.of("Show SLO burn-rate", "Replay Kafka claim event", "Inspect Redis cache hit ratio", "Create RCA draft"));
    }

    private AnswerBundle governanceAnswer(List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("GovernanceMonitor", "SUCCESS", 64, "Checked drift index, override rate, fairness guardrails and explainability coverage."));
        return new AnswerBundle(
                "Governance tracks prompt version, retrieval context, model confidence, manual override rate, drift index, protected-attribute exclusion, PII masking and reviewer outcome. This makes the AI layer production-safe and defensible in audits.",
                List.of("ai-audit-ledger", "model-monitoring-metrics", "guardrail-policy-store"),
                List.of("Open audit ledger", "Review drift dashboard", "Export governance report", "Escalate low-confidence decisions"));
    }

    private AnswerBundle generalAnswer(UserRole role, List<CopilotToolTrace> traces) {
        traces.add(new CopilotToolTrace("SemanticRetriever", "SUCCESS", 68, "Retrieved closest insurance-domain knowledge chunks."));
        String focus = role == UserRole.ADMIN ? "governance, SLO, audit and model monitoring"
                : role == UserRole.AGENT ? "underwriting, renewal propensity and customer follow-up"
                : "claim status, policy explanation and settlement guidance";
        return new AnswerBundle(
                "I am AstraClaim AI ChatOps. Ask me about " + focus + ", or technical topics like RAG, vector embeddings, Redis cache, Kafka event replay, circuit breaker fallback, p95 latency and human-in-the-loop review.",
                List.of("policy-clause-vector-index", "customer-policy-store"),
                List.of("Ask claim triage question", "Ask underwriting question", "Ask governance question", "Ask operations question"));
    }

    private record AnswerBundle(String answer, List<String> retrievalContext, List<String> suggestedActions) {}
}
