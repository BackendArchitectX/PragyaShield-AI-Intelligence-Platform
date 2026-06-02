package com.pragyashield.insurance.ai.chatops;

import java.util.List;
import java.util.Map;

public record AstraClaimPromptEnvelope(
        String systemPrompt,
        String domainPrompt,
        List<String> guardrails,
        Map<String, Object> telemetry
) {}
