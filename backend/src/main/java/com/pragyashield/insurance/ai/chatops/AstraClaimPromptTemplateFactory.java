package com.pragyashield.insurance.ai.chatops;

import com.pragyashield.insurance.ai.VectorDocument;
import com.pragyashield.insurance.model.ChatIntent;
import com.pragyashield.insurance.model.UserRole;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AstraClaimPromptTemplateFactory {

    public AstraClaimPromptEnvelope build(String systemPrompt,
                                          UserRole role,
                                          ChatIntent intent,
                                          String sanitizedPrompt,
                                          List<VectorDocument> retrievedDocuments,
                                          List<AstraClaimToolResult> toolResults) {
        String contextBlock = retrievedDocuments.stream()
                .map(doc -> "- [" + doc.source() + "] " + doc.content())
                .reduce("", (left, right) -> left + right + "\n");

        String toolBlock = toolResults.stream()
                .map(tool -> "- " + tool.toolName() + " => " + tool.outputSummary() + " payload=" + tool.payload())
                .reduce("", (left, right) -> left + right + "\n");

        String domainPrompt = """
                ROLE: %s
                INTENT: %s
                USER_PROMPT_SANITIZED: %s

                RETRIEVED_RAG_CONTEXT:
                %s
                TOOL_CALLING_OUTPUTS:
                %s
                RESPONSE_CONTRACT:
                1. Answer like an insurance domain expert.
                2. Mention reason codes, risk signals, SLA impact, and next-best-action.
                3. Do not make final claim rejection, pricing exception, or compliance decision without human approval.
                4. Explain any technical keyword used: RAG, vector embeddings, Kafka, Redis, circuit breaker, audit ledger, p95 latency.
                """.formatted(role, intent, sanitizedPrompt, contextBlock, toolBlock);

        Map<String, Object> telemetry = new LinkedHashMap<>();
        telemetry.put("promptVersion", "astraclaim-v2.1");
        telemetry.put("generatedAt", Instant.now().toString());
        telemetry.put("retrievedChunks", retrievedDocuments.size());
        telemetry.put("toolCalls", toolResults.size());
        telemetry.put("temperature", 0.2);
        telemetry.put("maxOutputTokens", 650);

        return new AstraClaimPromptEnvelope(systemPrompt, domainPrompt, List.of(
                "PII_REDACTION_REQUIRED",
                "SOURCE_GROUNDED_ANSWER_ONLY",
                "HUMAN_APPROVAL_FOR_FINAL_DECISION",
                "NO_PROTECTED_ATTRIBUTE_PRICING",
                "AUDIT_LEDGER_REFERENCE_REQUIRED"
        ), telemetry);
    }
}
