package com.pragyashield.insurance.dto;

import java.util.List;
import java.util.Map;

public record RecommendationResponse(
        String customerId,
        String recommendedProduct,
        int fitScore,
        double estimatedPremium,
        List<String> reasons,
        List<String> exclusionsToExplain,
        Map<String, Number> scoreBreakdown
) {}
