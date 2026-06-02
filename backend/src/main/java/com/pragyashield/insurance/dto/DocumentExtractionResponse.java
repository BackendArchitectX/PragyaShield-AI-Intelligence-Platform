package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.DocumentIntelligenceResult;
import java.util.List;

public record DocumentExtractionResponse(
        DocumentIntelligenceResult result,
        List<String> ragChunksCreated,
        List<String> downstreamEvents
) {}
