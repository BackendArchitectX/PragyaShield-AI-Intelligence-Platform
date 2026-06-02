package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.FraudGraphResponse;
import com.pragyashield.insurance.service.FraudGraphService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fraud-graph")
public class FraudGraphController {
    private final FraudGraphService fraudGraphService;

    public FraudGraphController(FraudGraphService fraudGraphService) {
        this.fraudGraphService = fraudGraphService;
    }

    @GetMapping("/claims/{claimNumber}")
    public FraudGraphResponse claimGraph(@PathVariable String claimNumber) {
        return fraudGraphService.buildGraph(claimNumber);
    }
}
