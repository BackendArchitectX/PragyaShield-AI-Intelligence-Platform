package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.CreatePolicyRequest;
import com.pragyashield.insurance.dto.PolicyResponse;
import com.pragyashield.insurance.service.PolicyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public List<PolicyResponse> policies() {
        return policyService.findAll();
    }

    @GetMapping("/{policyNumber}")
    public PolicyResponse policy(@PathVariable String policyNumber) {
        return policyService.findByPolicyNumber(policyNumber);
    }

    @GetMapping("/customer/{customerId}")
    public List<PolicyResponse> customerPolicies(@PathVariable String customerId) {
        return policyService.findByCustomerId(customerId);
    }

    @PostMapping
    public PolicyResponse createPolicy(@Valid @RequestBody CreatePolicyRequest request) {
        return policyService.create(request);
    }
}
