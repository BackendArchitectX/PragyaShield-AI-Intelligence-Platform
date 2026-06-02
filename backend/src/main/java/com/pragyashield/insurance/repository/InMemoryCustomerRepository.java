package com.pragyashield.insurance.repository;

import com.pragyashield.insurance.domain.CustomerProfile;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryCustomerRepository {
    private final ConcurrentMap<String, CustomerProfile> customers = new ConcurrentHashMap<>();

    @PostConstruct
    void seed() {
        save(new CustomerProfile("CUST-1001", "Rajesh Kumar Sharma", "rajesh@email.com", "+91-9000000001", 36, "Pune", 42, 84,
                List.of("POLICY_RECOMMENDATION", "CLAIM_ASSISTANCE", "AI_CHATOPS"), LocalDate.now().minusMonths(42)));
        save(new CustomerProfile("CUST-1002", "Amit Patel", "amit@email.com", "+91-9000000002", 31, "Nagpur", 4, 51,
                List.of("CLAIM_ASSISTANCE", "DOCUMENT_EXTRACTION"), LocalDate.now().minusMonths(4)));
        save(new CustomerProfile("CUST-1003", "Neha Kulkarni", "neha@email.com", "+91-9000000003", 44, "Mumbai", 74, 91,
                List.of("POLICY_RECOMMENDATION", "UNDERWRITING_ASSISTANCE"), LocalDate.now().minusMonths(74)));
    }

    public CustomerProfile save(CustomerProfile profile) {
        customers.put(profile.customerId(), profile);
        return profile;
    }

    public Optional<CustomerProfile> findById(String customerId) {
        return Optional.ofNullable(customers.get(customerId));
    }

    public Optional<CustomerProfile> findByEmail(String email) {
        return customers.values().stream()
                .filter(customer -> customer.email().equalsIgnoreCase(email))
                .findFirst();
    }

    public List<CustomerProfile> findAll() {
        return customers.values().stream()
                .sorted(Comparator.comparing(CustomerProfile::customerId))
                .toList();
    }

    public int count() {
        return customers.size();
    }
}
