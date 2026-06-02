package com.pragyashield.insurance.ai;

import java.util.List;

public record AiProviderResponse(
        String providerName,
        String modelName,
        String generatedText,
        int promptTokens,
        int completionTokens,
        int latencyMs,
        List<String> safetyLabels
) {}
