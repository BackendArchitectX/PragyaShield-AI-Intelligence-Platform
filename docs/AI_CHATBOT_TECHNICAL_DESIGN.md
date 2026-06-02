# AstraClaim AI ChatOps Technical Design

## Goal

AstraClaim AI ChatOps is a role-aware AI chatbot for insurance operations. It supports customer claim assistance, agent underwriting support and admin governance/operations analysis.

## Request flow

1. User sends a prompt from full chatbot page or floating chatbot widget.
2. Frontend classifies context by logged-in role: Customer, Agent or Admin.
3. Backend receives request through `POST /api/ai/astraclaim/chat`.
4. `PromptGuardrailService` masks PII and neutralizes risky instructions.
5. `AstraClaimChatOpsService` classifies the intent.
6. `RagRetrievalService` retrieves policy, claim, fraud and governance knowledge chunks.
7. `AstraClaimToolRouter` runs domain tool simulations.
8. `AstraClaimPromptTemplateFactory` builds a structured, governed prompt envelope.
9. `AiProviderClient` generates the AI response through a provider abstraction.
10. `AuditLedgerService` records the conversation metadata.
11. `ChatMemoryRepository` stores recent conversation events.
12. Response returns answer, confidence, retrieved context, guardrails, tool traces and audit reference.

## Supported intents

- `CLAIM_TRIAGE`
- `UNDERWRITING`
- `FRAUD_ANALYSIS`
- `POLICY_RECOMMENDATION`
- `OPERATIONS`
- `GOVERNANCE`
- `GENERAL`

## Why this is enterprise-grade

A simple chatbot directly calls an LLM and returns text. This design separates AI from core decisions. It adds safety, auditability and resilience:

- Provider abstraction for OpenAI, Azure OpenAI, Gemini, Bedrock or internal LLM gateway
- Deterministic fallback path
- Human approval for rejection and pricing exceptions
- RAG-grounded answer contract
- Tool-calling trace for explainability
- Prompt versioning and telemetry
- Guardrail policy enforcement
- Conversation memory separated from transactional system of record
- Runtime observability through p95 latency, SLO burn-rate, drift index and override rate
