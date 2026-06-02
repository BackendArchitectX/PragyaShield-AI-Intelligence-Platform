# PragyaShield AI Insurance API

Spring Boot backend skeleton for the AI integration layer.

## Endpoints

### Login

```http
POST /api/auth/login
```

Request:

```json
{"email":"admin@email.com","password":"admin123","role":"ADMIN"}
```

### Claim triage

```http
POST /api/ai/claims/triage
```

Request:

```json
{
  "claimNumber":"AON-CLM-2026-00002",
  "customerName":"Amit Patel",
  "policyType":"VEHICLE",
  "claimAmount":45000,
  "customerTenureMonths":4,
  "previousClaims":2,
  "networkProvider":false,
  "documentComplete":false,
  "extractedDocumentSignals":["DUPLICATE_BILL_HASH"]
}
```

### Underwriting evaluation

```http
POST /api/ai/underwriting/evaluate
```

### Governance

```http
GET /api/ai/governance
GET /api/ai/audit-ledger
```

## Why mock AI?

The generated project uses a deterministic mock provider so it runs locally without paid keys. Replace `MockAiDecisionProvider` with a real LLM/ML implementation behind the `AiDecisionProvider` interface.

## AstraClaim AI ChatOps Backend

Added a chatbot-oriented service layer for enterprise-grade AI discussion.

### Endpoint

```http
POST /api/ai/copilot/chat
```

Request:

```json
{
  "conversationId": "CONV-123",
  "role": "ADMIN",
  "prompt": "Show model drift and audit ledger posture",
  "contextTags": ["claims", "governance"],
  "runtimeMode": "RAG + Tool Calling"
}
```

Response includes:

- chatbotName
- intent
- confidence
- answer
- retrievalContext
- suggestedActions
- guardrails
- toolTraces
- auditReference
- respondedAt

### Enterprise-grade design points

- Prompt classification
- PII redaction
- RAG retrieval context
- Tool calling abstraction
- Deterministic fallback
- Audit ledger
- Governance profile endpoint
- Human review guardrails

## Major Java Backend Code Added for Enterprise-Grade Project

This version now contains a more complete Java backend instead of only static mock responses.

### Main Java modules

- `domain/` - insurance domain records and enums: `Policy`, `Claim`, `CustomerProfile`, `RiskSignal`, `FraudGraph`, `SettlementPlan`, payment and status enums.
- `repository/` - in-memory repositories with seeded customer, policy, claim and payment data.
- `service/` - business orchestration services:
  - `ClaimService`
  - `PolicyService`
  - `CustomerService`
  - `FraudSignalService`
  - `FraudGraphService`
  - `DocumentIntelligenceService`
  - `RecommendationService`
  - `SettlementOrchestratorService`
  - `SettlementDecisionService`
  - `RiskScoringEngine`
  - `DashboardService`
- `ai/` - AI integration abstraction:
  - `AiProviderClient`
  - `MockGenerativeAiClient`
  - `RagRetrievalService`
  - `PromptGuardrailService`
  - `VectorDocument`
- `controller/` - REST APIs for claims, policies, customers, dashboard, documents, recommendations, fraud graph and chatbot.

### New APIs

```http
GET /api/customers
GET /api/customers/{customerId}

GET /api/policies
GET /api/policies/{policyNumber}
GET /api/policies/customer/{customerId}
POST /api/policies

GET /api/claims
GET /api/claims/{claimNumber}
GET /api/claims/customer/{customerId}
POST /api/claims
POST /api/claims/settlement/decision

POST /api/documents/ai/ingest
GET /api/fraud-graph/claims/{claimNumber}
POST /api/recommendations/policy
GET /api/dashboard/{role}

POST /api/ai/copilot/chat
GET /api/ai/copilot/profile
```

### Sample create claim request

```json
{
  "policyNumber": "POL-VEH-2002",
  "customerId": "CUST-1002",
  "claimantName": "Amit Patel",
  "policyType": "VEHICLE",
  "claimAmount": 185000,
  "description": "High-value repair claim with incomplete documents",
  "networkProvider": false,
  "documentComplete": false,
  "uploadedDocuments": ["repair_estimate_duplicate_copy.jpg"]
}
```

### Sample chatbot request

```json
{
  "conversationId": "CONV-STAFF-001",
  "role": "ADMIN",
  "prompt": "Explain claim fraud risk with RAG, vector search, PII redaction, Kafka replay and audit ledger",
  "contextTags": ["claims", "fraud", "governance"],
  "runtimeMode": "RAG + Tool Calling + Guardrails"
}
```

### Architecture talking points

- Domain-driven modularization separates claim lifecycle, policy lifecycle, AI gateway, RAG retrieval, fraud graph and settlement orchestration.
- AI decisions are not treated as final authority. High-risk pricing, rejection and fraud decisions remain human-in-the-loop.
- The AI provider is abstracted using `AiProviderClient`, so the mock provider can be replaced with OpenAI, Azure OpenAI, Gemini, Bedrock or an internal LLM gateway.
- RAG and prompt guardrails are coded as first-class services, not frontend-only labels.
- Every sensitive AI workflow produces an audit reference through `AuditLedgerService`.
- The design supports future upgrades to PostgreSQL/JPA, Redis, Kafka outbox, vector DB and graph DB without changing controller contracts.
