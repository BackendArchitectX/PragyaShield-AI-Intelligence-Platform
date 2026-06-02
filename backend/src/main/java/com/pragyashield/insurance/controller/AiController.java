package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.AiDecisionResponse;
import com.pragyashield.insurance.dto.ClaimTriageRequest;
import com.pragyashield.insurance.dto.CopilotChatRequest;
import com.pragyashield.insurance.dto.CopilotChatResponse;
import com.pragyashield.insurance.dto.UnderwritingRequest;
import com.pragyashield.insurance.dto.UnderwritingResponse;
import com.pragyashield.insurance.service.AiDecisionProvider;
import com.pragyashield.insurance.service.AuditLedgerService;
import com.pragyashield.insurance.service.AstraClaimChatOpsService;
import jakarta.validation.Valid;
import com.pragyashield.insurance.model.UserRole;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final AiDecisionProvider aiDecisionProvider;
    private final AuditLedgerService auditLedgerService;
    private final AstraClaimChatOpsService astraClaimChatOpsService;

    public AiController(AiDecisionProvider aiDecisionProvider,
                        AuditLedgerService auditLedgerService,
                        AstraClaimChatOpsService astraClaimChatOpsService) {
        this.aiDecisionProvider = aiDecisionProvider;
        this.auditLedgerService = auditLedgerService;
        this.astraClaimChatOpsService = astraClaimChatOpsService;
    }

    @PostMapping("/claims/triage")
    public AiDecisionResponse triageClaim(@Valid @RequestBody ClaimTriageRequest request) {
        return aiDecisionProvider.triageClaim(request);
    }

    @PostMapping("/underwriting/evaluate")
    public UnderwritingResponse evaluateUnderwriting(@Valid @RequestBody UnderwritingRequest request) {
        return aiDecisionProvider.evaluateUnderwriting(request);
    }



    @PostMapping({"/astraclaim/chat", "/copilot/chat"})
    public CopilotChatResponse chatWithAstraClaim(@Valid @RequestBody CopilotChatRequest request) {
        return astraClaimChatOpsService.chat(request);
    }

    @GetMapping({"/astraclaim/profile", "/copilot/profile"})
    public Map<String, Object> copilotTechnicalProfile() {
        return astraClaimChatOpsService.technicalProfile(UserRole.ADMIN);
    }

    @GetMapping("/governance")
    public Map<String, Object> governance() {
        return Map.of(
                "explainabilityCoverage", "100%",
                "biasGuardrail", "PASS",
                "manualOverrideRate", "8.4%",
                "piiRedaction", "ACTIVE",
                "modelDriftIndex", 0.07
        );
    }

    @GetMapping("/audit-ledger")
    public List<String> auditLedger() {
        return auditLedgerService.recentEvents();
    }
}
