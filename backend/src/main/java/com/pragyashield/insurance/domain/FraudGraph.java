package com.pragyashield.insurance.domain;

import java.util.List;

public record FraudGraph(
        String claimNumber,
        List<FraudGraphNode> nodes,
        List<FraudGraphEdge> edges,
        int graphRiskScore,
        List<String> investigationSteps
) {}
