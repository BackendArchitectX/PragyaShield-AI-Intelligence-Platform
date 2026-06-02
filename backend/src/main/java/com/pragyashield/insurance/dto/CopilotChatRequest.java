package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CopilotChatRequest(
        String conversationId,
        @NotNull UserRole role,
        @NotBlank String prompt,
        List<String> contextTags,
        String runtimeMode
) {}
