package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.FraudGraph;
import java.util.List;

public record FraudGraphResponse(
        FraudGraph graph,
        List<String> aiNarrative,
        List<String> investigationPlaybook
) {}
