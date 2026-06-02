# PragyaShield Architecture

## High-level flow

```text
Angular Portal
  Customer / Agent / Admin
        |
        v
API Gateway / Spring Security Layer
  auth, rate limit, role-based access, audit headers
        |
        v
Insurance Domain Services
  Policy Service, Claim Service, User Service, Transaction Service
        |
        v
AI Decision Layer
  Feature extraction -> risk score -> reason codes -> recommended decision -> governance checks
        |
        v
Human Review Console
  manual override, reviewer notes, audit ledger, settlement workflow
```

## AI integration approach

The backend uses an `AiDecisionProvider` abstraction. In the generated project, `MockAiDecisionProvider` gives deterministic demo results so the project can run without paid API keys. A real provider can later be added behind the same interface.

## Architecture design points

- Keep domain services independent from AI provider implementation.
- Never auto-reject based only on AI. High-risk output is routed to human review.
- Store reason codes, model confidence, input feature hash, and reviewer override in audit ledger.
- Mask PII before AI analysis.
- Track model drift, override rate, and SLA breach risk.
- Separate explainability from raw model output to make it reviewer-friendly.
