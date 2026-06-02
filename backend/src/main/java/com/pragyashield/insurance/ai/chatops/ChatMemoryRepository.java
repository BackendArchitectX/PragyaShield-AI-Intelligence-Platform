package com.pragyashield.insurance.ai.chatops;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class ChatMemoryRepository {
    private final Map<String, List<AstraClaimConversationEvent>> eventsByConversation = new ConcurrentHashMap<>();

    public void append(AstraClaimConversationEvent event) {
        eventsByConversation.computeIfAbsent(event.conversationId(), key -> new ArrayList<>()).add(event);
    }

    public List<AstraClaimConversationEvent> recent(String conversationId) {
        return eventsByConversation.getOrDefault(conversationId, List.of()).stream()
                .sorted(Comparator.comparing(AstraClaimConversationEvent::createdAt).reversed())
                .limit(10)
                .toList();
    }

    public int totalEvents() {
        return eventsByConversation.values().stream().mapToInt(List::size).sum();
    }
}
