package com.pragyashield.insurance.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record DocumentIngestionRequest(
        @NotBlank String claimNumber,
        @NotBlank String documentType,
        @NotBlank String fileName,
        Map<String, String> rawMetadata
) {}
