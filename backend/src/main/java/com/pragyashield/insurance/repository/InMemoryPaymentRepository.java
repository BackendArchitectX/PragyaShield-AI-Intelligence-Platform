package com.pragyashield.insurance.repository;

import com.pragyashield.insurance.domain.PaymentStatus;
import com.pragyashield.insurance.domain.PremiumPayment;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryPaymentRepository {
    private final List<PremiumPayment> payments = new CopyOnWriteArrayList<>();

    @PostConstruct
    void seed() {
        payments.add(new PremiumPayment("PAY-1001", "POL-HEALTH-1001", LocalDate.now().minusMonths(1), 18_500, PaymentStatus.PAID, "UPI", "UPI-AEG-1001"));
        payments.add(new PremiumPayment("PAY-1002", "POL-VEH-2002", LocalDate.now().plusDays(14), 15_200, PaymentStatus.DUE, "CARD", "NA"));
        payments.add(new PremiumPayment("PAY-1003", "POL-LIFE-3003", LocalDate.now().minusDays(10), 32_000, PaymentStatus.PAID, "NET_BANKING", "NB-AEG-3003"));
    }

    public List<PremiumPayment> findByPolicyNumber(String policyNumber) {
        return payments.stream()
                .filter(payment -> payment.policyNumber().equals(policyNumber))
                .sorted(Comparator.comparing(PremiumPayment::dueDate).reversed())
                .toList();
    }

    public List<PremiumPayment> findAll() {
        return payments.stream().sorted(Comparator.comparing(PremiumPayment::dueDate).reversed()).toList();
    }

    public long countByStatus(PaymentStatus status) {
        return payments.stream().filter(payment -> payment.status() == status).count();
    }
}
