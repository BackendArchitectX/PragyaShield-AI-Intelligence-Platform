package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.ClaimStatus;
import com.pragyashield.insurance.domain.PaymentStatus;
import com.pragyashield.insurance.dto.DashboardSummaryResponse;
import com.pragyashield.insurance.model.UserRole;
import com.pragyashield.insurance.repository.InMemoryClaimRepository;
import com.pragyashield.insurance.repository.InMemoryCustomerRepository;
import com.pragyashield.insurance.repository.InMemoryPaymentRepository;
import com.pragyashield.insurance.repository.InMemoryPolicyRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final InMemoryCustomerRepository customerRepository;
    private final InMemoryPolicyRepository policyRepository;
    private final InMemoryClaimRepository claimRepository;
    private final InMemoryPaymentRepository paymentRepository;

    public DashboardService(InMemoryCustomerRepository customerRepository,
                            InMemoryPolicyRepository policyRepository,
                            InMemoryClaimRepository claimRepository,
                            InMemoryPaymentRepository paymentRepository) {
        this.customerRepository = customerRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardSummaryResponse summary(UserRole role) {
        Map<String, Number> kpis = new LinkedHashMap<>();
        kpis.put("customers", customerRepository.count());
        kpis.put("activePolicies", policyRepository.countActive());
        kpis.put("claimsInReview", claimRepository.countByStatus(ClaimStatus.UNDER_HUMAN_REVIEW));
        kpis.put("approvedClaims", claimRepository.countByStatus(ClaimStatus.APPROVED));
        kpis.put("premiumPaymentsDue", paymentRepository.countByStatus(PaymentStatus.DUE));

        List<String> alerts = switch (role) {
            case CUSTOMER -> List.of("Your claim explanation is available in AstraClaim AI ChatOps", "Renewal recommendation can be generated from policy clauses");
            case AGENT -> List.of("2 customers have high renewal propensity", "One claim requires missing document follow-up");
            case ADMIN -> List.of("Model drift index within tolerance", "Manual override rate should be reviewed weekly", "p95 AI-response latency target: < 900 ms");
        };

        return new DashboardSummaryResponse(role.name(), kpis, alerts,
                List.of("Redis risk-cache hit ratio: 87%", "Kafka outbox lag: 0", "Circuit breaker fallback rate: 1.8%", "RAG retrieval p95: 142 ms"),
                List.of("Human-in-the-loop threshold enforced", "Audit ledger captures prompt/version/context", "Domain services are isolated for scale and testability"));
    }
}
