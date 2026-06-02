# PragyaShield AI Insurance Intelligence Platform

Enterprise-grade Java + Angular insurance platform upgraded from the previous portal with a visibly different UI and a real AI chatbot module.

## Preserved login options

The original three login options are still present and unchanged in concept:

1. Customer
2. Agent
3. Admin

The new AI modules are added on top of those roles.

## What is new in this version

### 1. AstraClaim AI ChatOps chatbot

A dedicated insurance AI chatbot is now added in three places:

- Sidebar route for Customer, Agent and Admin
- Full chatbot page: `/customer/astraclaim-chatops`, `/agent/astraclaim-chatops`, `/admin/astraclaim-chatops`
- Floating chatbot widget visible across the portal after login

Technical keywords shown in the UI and Java code:

- RAG Pipeline
- Vector Embeddings
- Semantic Search
- Tool Calling
- Prompt Guardrails
- PII Redaction
- Audit Ledger
- Redis Risk Cache
- Kafka Event Replay
- Circuit Breaker Fallback
- p95 Latency
- SLO Burn Rate
- Human-in-the-Loop Review
- Model Drift
- Manual Override Rate
- LLM Gateway
- Prompt Versioning
- Agentic Tool Router

### 2. Java backend AI chatbot APIs

New Java chatbot endpoint aliases:

```http
POST /api/ai/astraclaim/chat
GET  /api/ai/astraclaim/profile
```

Backward-compatible aliases are also kept:

```http
POST /api/ai/copilot/chat
GET  /api/ai/copilot/profile
```

### 3. enterprise-grade backend design

New Java modules added under:

```text
backend/src/main/java/com/pragyashield/insurance/ai/chatops
```

Important classes:

- `AstraClaimChatOpsService`
- `AstraClaimToolRouter`
- `AstraClaimPromptTemplateFactory`
- `AstraClaimPromptEnvelope`
- `AstraClaimToolResult`
- `ChatMemoryRepository`
- `AstraClaimConversationEvent`

These modules show RAG, tool routing, prompt construction, guardrails, telemetry, conversation memory, audit reference creation and deterministic fallback design.

### 4. Different UI

The UI is changed from a standard insurance portal style to a dark AI-command-center style with:

- Floating chatbot launcher
- Dark glass dashboard shell
- AI runtime chips
- Technical prompt lab
- Tool-calling trace cards
- RAG source panels
- Guardrail badges
- Governance and observability wording

## Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

## Run frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:4200
```

## Demo login roles

Use the login screen role tabs:

- Customer
- Agent
- Admin

The project intentionally keeps the three login options while adding AstraClaim AI ChatOps on top.

## Architecture talking points

This project can be explained as a production-minded insurance intelligence platform where AI is not placed directly in the critical path. The design uses deterministic rules, RAG-grounded answers, prompt guardrails, tool-calling traces, circuit breaker fallback, audit logging and human approval for high-risk decisions. This is safer than a simple chatbot because every AI recommendation is explainable, observable and reversible.
