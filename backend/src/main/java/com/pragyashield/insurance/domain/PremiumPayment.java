package com.pragyashield.insurance.domain;

import java.time.LocalDate;

public record PremiumPayment(
        String paymentId,
        String policyNumber,
        LocalDate dueDate,
        double amount,
        PaymentStatus status,
        String channel,
        String transactionReference
) {}
