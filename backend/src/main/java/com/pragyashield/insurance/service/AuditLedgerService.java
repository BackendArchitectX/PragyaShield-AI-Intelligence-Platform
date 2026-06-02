package com.pragyashield.insurance.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AuditLedgerService {
    private final List<String> events = Collections.synchronizedList(new ArrayList<>());

    public String record(String eventType, String entityId, String summary) {
        String ref = "AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        events.add(Instant.now() + " | " + ref + " | " + eventType + " | " + entityId + " | " + summary);
        return ref;
    }

    public List<String> recentEvents() {
        return events.reversed().stream().limit(25).toList();
    }
}
