package com.pragyashield.insurance.ai.chatops;

import com.pragyashield.insurance.model.ChatIntent;
import com.pragyashield.insurance.model.UserRole;
import java.time.Instant;
import java.util.List;

public record AstraClaimConversationEvent(
        String conversationId,
        UserRole role,
        ChatIntent intent,
        String sanitizedPrompt,
        int confidence,
        List<String> retrievalContext,
        String auditRef,
        Instant createdAt
) {}
