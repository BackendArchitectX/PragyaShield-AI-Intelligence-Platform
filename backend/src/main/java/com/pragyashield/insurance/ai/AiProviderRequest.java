package com.pragyashield.insurance.ai;

import com.pragyashield.insurance.model.UserRole;
import java.util.List;
import java.util.Map;

public record AiProviderRequest(
        String systemPrompt,
        String userPrompt,
        UserRole role,
        List<String> retrievedContext,
        Map<String, Object> toolOutputs,
        double temperature,
        int maxTokens
) {}
