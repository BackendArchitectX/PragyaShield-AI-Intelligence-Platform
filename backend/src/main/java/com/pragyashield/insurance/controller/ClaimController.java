package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.ClaimResponse;
import com.pragyashield.insurance.dto.CreateClaimRequest;
import com.pragyashield.insurance.dto.SettlementDecisionRequest;
import com.pragyashield.insurance.dto.SettlementDecisionResponse;
import com.pragyashield.insurance.service.ClaimService;
import com.pragyashield.insurance.service.SettlementDecisionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimService claimService;
    private final SettlementDecisionService settlementDecisionService;

    public ClaimController(ClaimService claimService, SettlementDecisionService settlementDecisionService) {
        this.claimService = claimService;
        this.settlementDecisionService = settlementDecisionService;
    }

    @GetMapping
    public List<ClaimResponse> claims() {
        return claimService.findAll();
    }

    @GetMapping("/{claimNumber}")
    public ClaimResponse claim(@PathVariable String claimNumber) {
        return claimService.findByClaimNumber(claimNumber);
    }

    @GetMapping("/customer/{customerId}")
    public List<ClaimResponse> customerClaims(@PathVariable String customerId) {
        return claimService.findByCustomerId(customerId);
    }

    @PostMapping
    public ClaimResponse createClaim(@Valid @RequestBody CreateClaimRequest request) {
        return claimService.create(request);
    }

    @PostMapping("/settlement/decision")
    public SettlementDecisionResponse decideSettlement(@Valid @RequestBody SettlementDecisionRequest request) {
        return settlementDecisionService.decide(request);
    }
}
