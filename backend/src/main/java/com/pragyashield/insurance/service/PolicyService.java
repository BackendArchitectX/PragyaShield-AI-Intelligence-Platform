package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.CustomerProfile;
import com.pragyashield.insurance.domain.Policy;
import com.pragyashield.insurance.domain.PolicyStatus;
import com.pragyashield.insurance.dto.CreatePolicyRequest;
import com.pragyashield.insurance.dto.PolicyResponse;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.repository.InMemoryCustomerRepository;
import com.pragyashield.insurance.repository.InMemoryPolicyRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PolicyService {
    private final InMemoryPolicyRepository policyRepository;
    private final InMemoryCustomerRepository customerRepository;
    private final AuditLedgerService auditLedgerService;

    public PolicyService(InMemoryPolicyRepository policyRepository,
                         InMemoryCustomerRepository customerRepository,
                         AuditLedgerService auditLedgerService) {
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.auditLedgerService = auditLedgerService;
    }

    public List<PolicyResponse> findAll() {
        return policyRepository.findAll().stream().map(this::toPolicyResponse).toList();
    }

    public List<PolicyResponse> findByCustomerId(String customerId) {
        return policyRepository.findByCustomerId(customerId).stream().map(this::toPolicyResponse).toList();
    }

    public PolicyResponse findByPolicyNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber)
                .map(this::toPolicyResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyNumber));
    }

    public PolicyResponse create(CreatePolicyRequest request) {
        CustomerProfile customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));

        String policyNumber = "POL-" + request.type().name().substring(0, Math.min(4, request.type().name().length())) + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        int renewalScore = Math.min(95, 50 + customer.loyaltyScore() / 2 + (request.riders() == null ? 0 : request.riders().size() * 3));
        int affordability = calculateAffordability(request.premiumAmount(), request.sumInsured());

        Policy policy = new Policy(policyNumber, request.customerId(), request.type(), PolicyStatus.PENDING_UNDERWRITING,
                request.productName(), request.sumInsured(), request.premiumAmount(), LocalDate.now(), LocalDate.now().plusYears(1),
                request.riders() == null ? List.of() : request.riders(), defaultExclusions(request.type()), renewalScore, affordability);

        policyRepository.save(policy);
        auditLedgerService.record("POLICY_CREATED", policyNumber, "customerId=" + request.customerId() + ", product=" + request.productName());
        return toPolicyResponse(policy);
    }

    private PolicyResponse toPolicyResponse(Policy policy) {
        List<String> insights = new ArrayList<>();
        insights.add("Renewal propensity score: " + policy.renewalPropensityScore());
        insights.add("Affordability score: " + policy.affordabilityScore());
        insights.add("Vector-search ready policy clauses: riders=" + policy.riders().size() + ", exclusions=" + policy.exclusions().size());

        List<String> actions = new ArrayList<>();
        if (policy.affordabilityScore() < 55) actions.add("Offer lower premium variant or EMI recommendation.");
        if (policy.renewalPropensityScore() > 80) actions.add("Trigger renewal upsell journey.");
        actions.add("Generate customer-safe policy explanation with AstraClaim AI ChatOps.");
        return new PolicyResponse(policy, insights, actions);
    }

    private int calculateAffordability(double premium, double sumInsured) {
        double ratio = premium / Math.max(sumInsured, 1);
        return Math.max(35, Math.min(95, (int) Math.round(95 - ratio * 800)));
    }

    private List<String> defaultExclusions(com.pragyashield.insurance.domain.PolicyType type) {
        return switch (type) {
            case HEALTH -> List.of("Pre-existing disease waiting period", "Cosmetic procedure exclusion");
            case VEHICLE -> List.of("Wear and tear", "Driving under influence", "Unauthorized modification");
            case LIFE -> List.of("Material misrepresentation", "Policy waiting-period exclusions");
            case TRAVEL -> List.of("Known medical condition without disclosure", "Unapproved adventure sport");
            case HOME -> List.of("Intentional damage", "Unoccupied property exception");
        };
    }
}
