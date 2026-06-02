# What changed from the original project

The previous portal was treated as the base insurance application. This version adds an enterprise-grade AI layer without removing Customer, Agent and Admin login options.

## Added from my side

1. AstraClaim AI ChatOps chatbot
   - Dedicated full-page chatbot route
   - Floating chatbot widget available after login
   - Role-aware answers for Customer, Agent and Admin
   - Technical keywords visible in UI

2. Java AI integration
   - Chatbot REST APIs
   - RAG retrieval service
   - Prompt guardrail service
   - Tool-calling router
   - Prompt template factory
   - Chat memory repository
   - Audit-ledger recording
   - Mock LLM provider abstraction

3. enterprise-grade architecture elements
   - Human-in-the-loop decisioning
   - Deterministic fallback when AI fails
   - Circuit breaker strategy
   - Kafka event replay concept
   - Redis cache concept
   - p95 latency and SLO burn-rate observability
   - Model drift and manual override governance
   - PII redaction before inference
   - Immutable audit reference for every AI answer

4. Different UI
   - Dark AI command-center design
   - Chatbot launcher
   - Technical prompt lab
   - RAG source cards
   - Tool traces
   - Guardrail badges

## Files to review first

```text
frontend/src/app/shared/components/astra-claim-floating-chat.component.ts
frontend/src/app/features/ai-chatbot/astraclaim-chatops.component.ts
frontend/src/app/core/services/ai-intelligence.service.ts
backend/src/main/java/com/pragyashield/insurance/service/AstraClaimChatOpsService.java
backend/src/main/java/com/pragyashield/insurance/ai/chatops/AstraClaimToolRouter.java
backend/src/main/java/com/pragyashield/insurance/ai/chatops/AstraClaimPromptTemplateFactory.java
backend/src/main/java/com/pragyashield/insurance/controller/AiController.java
```
