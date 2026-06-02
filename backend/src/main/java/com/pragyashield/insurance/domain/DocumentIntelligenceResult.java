package com.pragyashield.insurance.domain;

import java.util.List;
import java.util.Map;

public record DocumentIntelligenceResult(
        String documentId,
        String documentType,
        int extractionConfidence,
        Map<String, String> extractedFields,
        List<String> detectedAnomalies,
        List<String> piiFieldsMasked,
        String vectorReference
) {}
