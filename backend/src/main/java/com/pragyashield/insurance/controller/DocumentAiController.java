package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.DocumentExtractionResponse;
import com.pragyashield.insurance.dto.DocumentIngestionRequest;
import com.pragyashield.insurance.service.DocumentIntelligenceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents/ai")
public class DocumentAiController {
    private final DocumentIntelligenceService documentIntelligenceService;

    public DocumentAiController(DocumentIntelligenceService documentIntelligenceService) {
        this.documentIntelligenceService = documentIntelligenceService;
    }

    @PostMapping("/ingest")
    public DocumentExtractionResponse ingest(@Valid @RequestBody DocumentIngestionRequest request) {
        return documentIntelligenceService.ingest(request);
    }
}
