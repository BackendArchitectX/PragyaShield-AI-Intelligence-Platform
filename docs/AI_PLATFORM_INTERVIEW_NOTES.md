# AI Platform Interview Explanation

## One-line project pitch

PragyaShield is an AI-native insurance intelligence platform that improves claim settlement speed and fraud detection while preserving explainability, human review, and governance.

## What I added beyond a normal insurance portal

- AI claim triage service to classify claims into low, medium, high, and critical risk.
- Underwriting copilot to recommend premium and identify risk factors.
- Fraud graph signals connecting provider, claim, policy, device, location, and repeated patterns.
- Governance layer for PII redaction, bias guardrails, explainability, and model drift monitoring.
- Human-in-the-loop workflow so AI recommends but does not blindly decide high-impact outcomes.

## Why this is enterprise-grade

At platform ownership level, the focus is not only writing APIs. The focus is system boundaries, risk ownership, operational excellence, AI safety, governance, auditability, and platform extensibility. This project shows how to add AI without tightly coupling business decisions to one model provider.

## Trade-offs

- Mock AI provider is used by default to make local development simple.
- Real-time streaming and Kafka can be added later for high-volume claim events.
- AI decisions are explainable and auditable, but final high-risk outcomes remain human-approved.

## Added Enterprise-Grade AI Chatbot: AstraClaim AI ChatOps

AstraClaim AI ChatOps is a separate AI chatbot module added on top of the existing Customer, Agent, and Admin login options. It does not replace the role-based authentication flow. The chatbot changes its behavior based on the logged-in role.

### Why this makes the project enterprise-grade

This is not a basic FAQ chatbot. It is positioned as a production-grade insurance copilot with the following architecture concepts:

- **RAG Pipeline**: Retrieves relevant policy clauses, claim history, underwriting rules, SOPs, and audit records before answering.
- **Vector Embeddings + Semantic Search**: Simulates document search over policy PDFs, claim notes, provider rules, and exclusion clauses.
- **Tool Calling**: Routes user prompts to domain tools such as ClaimTriageTool, FraudSignalGraph, UnderwritingEvaluator, GovernanceMonitor, and OpsTelemetryTool.
- **Prompt Guardrails**: Prevents unsafe final claim rejection or pricing decisions without human review.
- **PII Redaction**: Masks Aadhaar, PAN, phone, email, medical IDs, and bank references before AI inference.
- **Human-in-the-Loop Review**: Escalates high-risk, low-confidence, or pricing-exception cases to an Agent/Admin reviewer.
- **Audit Ledger**: Stores intent, model confidence, retrieval context, tool traces, and decision summary for compliance review.
- **Fallback Strategy**: Uses deterministic rule-engine fallback when AI provider latency or failure crosses threshold.
- **Observability**: Tracks p95 latency, model confidence, model drift, manual override rate, SLO burn-rate, and queue depth.

### Chatbot Technical Keywords to mention in interviews

RAG, vector embeddings, semantic search, prompt guardrails, PII redaction, tool calling, audit ledger, Redis cache, Kafka event replay, circuit breaker, timeout budget, fallback rule engine, model drift, manual override rate, p95 latency, SLO burn-rate, explainability, reason codes, human-in-the-loop.

### Interview-ready explanation

“In this project, I added AstraClaim AI ChatOps as a role-aware AI copilot on top of the existing insurance platform. Customer, Agent, and Admin login options remain unchanged. Based on the logged-in role, the chatbot answers claim, underwriting, fraud, policy, operations, and governance questions. Architecturally, I treated this as a production AI layer rather than a simple chatbot. The flow uses RAG-style retrieval, vector-index simulation, prompt classification, PII redaction, tool-calling traces, deterministic rule fallback, human-in-the-loop escalation, and audit-ledger recording. This makes every AI response explainable, observable, and reviewable.”

### Backend APIs added

- `POST /api/ai/copilot/chat` — accepts prompt, role, context tags, and runtime mode; returns chatbot answer with intent, confidence, retrieval context, suggested actions, guardrails, tool traces, and audit reference.
- `GET /api/ai/copilot/profile` — returns chatbot technical profile and supported keywords.

### Frontend route added

- `/customer/astraclaim-chatops`
- `/agent/astraclaim-chatops`
- `/admin/astraclaim-chatops`

The chatbot is visible from the sidebar for all three roles.

## Java Code Upgrade Notes

The backend now includes major Java implementation for enterprise-grade discussion:

1. **AI Gateway Abstraction**
   - `AiProviderClient` isolates the application from a specific AI vendor.
   - `MockGenerativeAiClient` allows local execution without paid API keys.
   - Production replacement can call OpenAI, Azure OpenAI, Gemini, Bedrock or internal LLM middleware.

2. **RAG Pipeline in Java**
   - `RagRetrievalService` simulates vector retrieval against insurance knowledge chunks.
   - It returns source-tagged chunks for claim triage, underwriting, fraud, governance and operations.

3. **Prompt Guardrails**
   - `PromptGuardrailService` redacts email, Indian phone, Aadhaar-like IDs and prompt-injection patterns before model calls.

4. **Claim AI Decisioning**
   - `ClaimService`, `FraudSignalService`, `RiskScoringEngine` and `SettlementOrchestratorService` implement the claim lifecycle.
   - The flow generates risk signals, risk score, risk band, AI recommendation, explainability and settlement plan.

5. **Fraud Graph**
   - `FraudGraphService` builds claim-policy-customer-provider-risk signal relationships.
   - This is interview-ready for explaining a future move to Neo4j/JanusGraph.

6. **Auditability**
   - Chatbot answers, policy recommendations, claim triage, document ingestion and settlement decisions write audit references.

7. **Role Safety**
   - Login still supports exactly three role options: Customer, Agent and Admin.
   - AI responses remain role-aware through `UserRole`.
