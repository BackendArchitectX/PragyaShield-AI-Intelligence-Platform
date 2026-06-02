package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.model.ChatIntent;
import java.time.Instant;
import java.util.List;

public record CopilotChatResponse(
        String conversationId,
        String chatbotName,
        ChatIntent intent,
        int confidence,
        String answer,
        List<String> retrievalContext,
        List<String> suggestedActions,
        List<String> guardrails,
        List<CopilotToolTrace> toolTraces,
        String auditReference,
        Instant respondedAt
) {}
