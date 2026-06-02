# PragyaShield AI Insurance Portal

Angular 18 standalone frontend for an enterprise-grade insurance platform demo.

## What changed from the previous Suraksha portal

- Project renamed to **PragyaShield AI Insurance Intelligence Platform**.
- Existing three login options are preserved exactly:
  - Customer: `rajesh@email.com` / `customer123`
  - Agent: `agent@email.com` / `agent123`
  - Admin: `admin@email.com` / `admin123`
- Added **AI Command Center** for all three roles.
- Added different UI treatment: dark AI hero, command-center cards, triage queue, underwriting copilot, fraud signal graph, and governance board.

## Run

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## AstraClaim AI ChatOps UI

A new sidebar module was added for every role:

- Customer: `/customer/astraclaim-chatops`
- Agent: `/agent/astraclaim-chatops`
- Admin: `/admin/astraclaim-chatops`

The chatbot UI includes:

- Conversation console
- Prompt Lab
- Runtime mode selector: RAG + Tool Calling, Rules Fallback, Governance Mode
- Technical keyword cards
- Knowledge source cards
- Starter prompts
- Tool-calling trace per answer
- Guardrail strip per answer
- Role-aware chatbot opening message

Key technical terms included in the UI: RAG Pipeline, Vector Embeddings, Semantic Search, Tool Calling, Prompt Guardrails, PII Redaction, Observability, Circuit Breaker, Human-in-the-Loop.
