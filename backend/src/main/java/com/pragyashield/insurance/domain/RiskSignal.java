package com.pragyashield.insurance.domain;

public record RiskSignal(
        RiskSignalType type,
        Severity severity,
        int weight,
        String explanation,
        String evidenceRef
) {}
