package com.pragyashield.insurance.domain;

public record FraudGraphEdge(
        String fromNode,
        String toNode,
        String relationship,
        int confidence
) {}
