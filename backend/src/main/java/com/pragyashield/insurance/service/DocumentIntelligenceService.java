package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.DocumentIntelligenceResult;
import com.pragyashield.insurance.dto.DocumentExtractionResponse;
import com.pragyashield.insurance.dto.DocumentIngestionRequest;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class DocumentIntelligenceService {
    private final AuditLedgerService auditLedgerService;

    public DocumentIntelligenceService(AuditLedgerService auditLedgerService) {
        this.auditLedgerService = auditLedgerService;
    }

    public DocumentExtractionResponse ingest(DocumentIngestionRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("claimNumber", request.claimNumber());
        fields.put("documentType", request.documentType());
        fields.put("fileName", request.fileName());
        fields.put("detectedVendor", inferVendor(request.fileName()));
        fields.put("ocrLanguage", "en-IN");

        List<String> anomalies = detectAnomalies(request);
        List<String> piiMasked = List.of("customerName", "mobile", "bankAccount", "aadhaarLikePattern");
        String vectorRef = "vec://pragyashield/docs/" + UUID.randomUUID().toString().substring(0, 12);
        int confidence = anomalies.isEmpty() ? 93 : Math.max(64, 88 - anomalies.size() * 9);

        DocumentIntelligenceResult result = new DocumentIntelligenceResult(
                "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                request.documentType(), confidence, fields, anomalies, piiMasked, vectorRef);

        String auditRef = auditLedgerService.record("DOCUMENT_AI_INGESTED", request.claimNumber(),
                "documentType=" + request.documentType() + ", vectorRef=" + vectorRef + ", anomalies=" + anomalies.size());

        return new DocumentExtractionResponse(result,
                List.of("policy-clause-chunk", "claim-evidence-chunk", "settlement-proof-chunk", "audit-ledger-context:" + auditRef),
                List.of("DOCUMENT_EMBEDDING_CREATED", "CLAIM_EVIDENCE_UPDATED", "RAG_INDEX_REFRESHED"));
    }

    private String inferVendor(String fileName) {
        String lower = fileName == null ? "" : fileName.toLowerCase();
        if (lower.contains("hospital")) return "Hospital Network Provider";
        if (lower.contains("garage") || lower.contains("repair")) return "Motor Repair Vendor";
        if (lower.contains("police") || lower.contains("fir")) return "Law Enforcement Document";
        return "Unknown Provider";
    }

    private List<String> detectAnomalies(DocumentIngestionRequest request) {
        String lower = request.fileName() == null ? "" : request.fileName().toLowerCase();
        if (lower.contains("duplicate") || lower.contains("copy")) {
            return List.of("DUPLICATE_DOCUMENT_HASH", "REQUIRES_MANUAL_VERIFICATION");
        }
        if (request.rawMetadata() != null && "true".equalsIgnoreCase(request.rawMetadata().getOrDefault("tampered", "false"))) {
            return List.of("METADATA_TAMPER_SIGNAL");
        }
        return List.of();
    }
}
