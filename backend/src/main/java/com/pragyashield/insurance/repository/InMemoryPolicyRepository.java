package com.pragyashield.insurance.repository;

import com.pragyashield.insurance.domain.Policy;
import com.pragyashield.insurance.domain.PolicyStatus;
import com.pragyashield.insurance.domain.PolicyType;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryPolicyRepository {
    private final ConcurrentMap<String, Policy> policies = new ConcurrentHashMap<>();

    @PostConstruct
    void seed() {
        save(new Policy("POL-HEALTH-1001", "CUST-1001", PolicyType.HEALTH, PolicyStatus.ACTIVE, "PragyaShield Health Protect Plus",
                800_000, 18_500, LocalDate.now().minusMonths(11), LocalDate.now().plusMonths(1),
                List.of("Cashless Hospital", "Critical Illness"), List.of("Pre-existing disease waiting period"), 82, 77));
        save(new Policy("POL-VEH-2002", "CUST-1002", PolicyType.VEHICLE, PolicyStatus.ACTIVE, "PragyaShield Motor Shield Elite",
                650_000, 15_200, LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(8),
                List.of("Zero Dep", "Engine Protect"), List.of("Wear and tear", "Drunk driving"), 49, 68));
        save(new Policy("POL-LIFE-3003", "CUST-1003", PolicyType.LIFE, PolicyStatus.ACTIVE, "PragyaShield Life Secure 360",
                5_000_000, 32_000, LocalDate.now().minusYears(2), LocalDate.now().plusYears(18),
                List.of("Accidental Death", "Waiver of Premium"), List.of("Material misrepresentation"), 93, 81));
    }

    public Policy save(Policy policy) {
        policies.put(policy.policyNumber(), policy);
        return policy;
    }

    public Optional<Policy> findByPolicyNumber(String policyNumber) {
        return Optional.ofNullable(policies.get(policyNumber));
    }

    public List<Policy> findByCustomerId(String customerId) {
        return policies.values().stream()
                .filter(policy -> policy.customerId().equals(customerId))
                .sorted(Comparator.comparing(Policy::policyNumber))
                .toList();
    }

    public List<Policy> findAll() {
        return policies.values().stream()
                .sorted(Comparator.comparing(Policy::policyNumber))
                .toList();
    }

    public long countActive() {
        return policies.values().stream().filter(policy -> policy.status() == PolicyStatus.ACTIVE).count();
    }
}
