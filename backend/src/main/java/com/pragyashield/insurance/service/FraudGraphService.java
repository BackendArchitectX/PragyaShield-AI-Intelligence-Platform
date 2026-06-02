package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.Claim;
import com.pragyashield.insurance.domain.FraudGraph;
import com.pragyashield.insurance.domain.FraudGraphEdge;
import com.pragyashield.insurance.domain.FraudGraphNode;
import com.pragyashield.insurance.dto.FraudGraphResponse;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.repository.InMemoryClaimRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FraudGraphService {
    private final InMemoryClaimRepository claimRepository;

    public FraudGraphService(InMemoryClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public FraudGraphResponse buildGraph(String claimNumber) {
        Claim claim = claimRepository.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimNumber));

        List<FraudGraphNode> nodes = new ArrayList<>();
        nodes.add(new FraudGraphNode(claim.claimNumber(), "Claim " + claim.claimNumber(), "CLAIM", claim.riskScore()));
        nodes.add(new FraudGraphNode(claim.policyNumber(), "Policy " + claim.policyNumber(), "POLICY", 20));
        nodes.add(new FraudGraphNode(claim.customerId(), "Customer " + claim.customerId(), "CUSTOMER", Math.max(10, claim.riskScore() / 2)));
        nodes.add(new FraudGraphNode("PROVIDER-" + (claim.networkProvider() ? "NETWORK" : "NON-NETWORK"), claim.networkProvider() ? "Network Provider" : "Non-Network Provider", "PROVIDER", claim.networkProvider() ? 12 : 45));
        claim.riskSignals().forEach(signal -> nodes.add(new FraudGraphNode(signal.type().name(), signal.type().name(), "RISK_SIGNAL", signal.weight())));

        List<FraudGraphEdge> edges = new ArrayList<>();
        edges.add(new FraudGraphEdge(claim.claimNumber(), claim.policyNumber(), "FILED_AGAINST", 99));
        edges.add(new FraudGraphEdge(claim.customerId(), claim.claimNumber(), "SUBMITTED", 98));
        edges.add(new FraudGraphEdge(claim.claimNumber(), "PROVIDER-" + (claim.networkProvider() ? "NETWORK" : "NON-NETWORK"), "SERVICED_BY", claim.networkProvider() ? 92 : 67));
        claim.riskSignals().forEach(signal -> edges.add(new FraudGraphEdge(claim.claimNumber(), signal.type().name(), "TRIGGERED_SIGNAL", Math.min(99, 60 + signal.weight()))));

        FraudGraph graph = new FraudGraph(claimNumber, nodes, edges, claim.riskScore(),
                List.of("Review high-weight risk signal first", "Check duplicate document vector hash", "Compare provider anomaly cluster", "Record SIU outcome in audit ledger"));

        return new FraudGraphResponse(graph,
                List.of("Graph score is driven by " + claim.riskSignals().size() + " risk signals.",
                        "Use graph-linked evidence before rejecting or settling the claim.",
                        "For advanced platform design, this can move to Neo4j/JanusGraph with Kafka change-data events."),
                graph.investigationSteps());
    }
}
