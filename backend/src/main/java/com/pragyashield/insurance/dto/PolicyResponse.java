package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.domain.Policy;
import java.util.List;

public record PolicyResponse(
        Policy policy,
        List<String> aiInsights,
        List<String> nextBestActions
) {}
