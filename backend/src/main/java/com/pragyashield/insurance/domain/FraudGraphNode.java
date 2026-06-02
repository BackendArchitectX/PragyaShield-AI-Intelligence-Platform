package com.pragyashield.insurance.domain;

public record FraudGraphNode(
        String nodeId,
        String label,
        String nodeType,
        int riskWeight
) {}
