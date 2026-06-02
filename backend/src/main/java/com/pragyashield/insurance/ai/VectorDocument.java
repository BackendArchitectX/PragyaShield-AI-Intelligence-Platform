package com.pragyashield.insurance.ai;

import java.util.Map;

public record VectorDocument(
        String id,
        String title,
        String content,
        String source,
        Map<String, String> metadata,
        double similarityScore
) {}
