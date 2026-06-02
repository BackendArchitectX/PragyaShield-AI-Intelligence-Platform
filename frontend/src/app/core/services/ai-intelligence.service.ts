import { Injectable } from '@angular/core';
import { AiCapability, AiChatIntent, AiChatMessage, AiKnowledgeSource, AiClaimInsight, AiExecutiveMetric, AiGovernanceMetric, AiToolTrace, AiUnderwritingSignal, UserRole } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AiIntelligenceService {
  getExecutiveMetrics(): AiExecutiveMetric[] {
    return [
      { label: 'AI Straight-Through Processing', value: '72%', change: '+18% QoQ', tone: 'positive', icon: 'bolt' },
      { label: 'Fraud Leakage Prevented', value: '₹2.8Cr', change: '+31% detection', tone: 'positive', icon: 'shield' },
      { label: 'Human Review Queue', value: '19', change: '-42% backlog', tone: 'positive', icon: 'fact_check' },
      { label: 'Model Drift Index', value: '0.07', change: 'stable', tone: 'neutral', icon: 'monitor_heart' }
    ];
  }

  getClaimInsights(): AiClaimInsight[] {
    return [
      {
        claimId: 'CLM001', claimNumber: 'AON-CLM-2026-00001', customerName: 'Rajesh Kumar Sharma', policyType: 'HEALTH',
        claimAmount: 150000, riskScore: 32, riskBand: 'LOW', confidence: 91, recommendedDecision: 'AUTO_APPROVE',
        fraudSignals: ['Hospital is in approved network', 'Bill pattern matches procedure benchmark', 'No duplicate claim hash found'],
        explainability: ['Procedure-to-diagnosis match is strong', 'Claim amount is within policy slab', 'Customer payment history is consistent'],
        nextBestActions: ['Auto-approve up to ₹1,35,000', 'Trigger payment workflow', 'Send settlement summary to customer'],
        slaHoursRemaining: 18
      },
      {
        claimId: 'CLM002', claimNumber: 'AON-CLM-2026-00002', customerName: 'Amit Patel', policyType: 'VEHICLE',
        claimAmount: 45000, riskScore: 68, riskBand: 'HIGH', confidence: 84, recommendedDecision: 'MANUAL_REVIEW',
        fraudSignals: ['Vehicle photo metadata mismatch', 'Incident location differs from customer route history', 'Similar claim filed in same pin code cluster'],
        explainability: ['Damage severity and repair estimate variance is high', 'Claim submitted 2 days after policy renewal', 'Surveyor approval required'],
        nextBestActions: ['Assign field surveyor', 'Request geo-tagged images', 'Hold settlement until evidence verification'],
        slaHoursRemaining: 7
      },
      {
        claimId: 'CLM003', claimNumber: 'AON-CLM-2026-00003', customerName: 'Priya Mehta', policyType: 'HEALTH',
        claimAmount: 200000, riskScore: 47, riskBand: 'MEDIUM', confidence: 88, recommendedDecision: 'REQUEST_DOCUMENTS',
        fraudSignals: ['Discharge summary uploaded', 'Missing pharmacy breakup', 'Provider claim frequency slightly elevated'],
        explainability: ['Medical necessity is valid', 'Non-payable consumables need separation', 'No known customer fraud marker'],
        nextBestActions: ['Request itemized pharmacy bill', 'Pre-calculate admissible amount', 'Keep claim within 24-hour SLA'],
        slaHoursRemaining: 13
      }
    ];
  }

  getUnderwritingSignals(): AiUnderwritingSignal[] {
    return [
      {
        proposalId: 'UW-9821', applicantName: 'Neha Deshmukh', product: 'Aegis Health Elite', predictedPremium: 18400,
        affordabilityScore: 86, riskScore: 28,
        reasonCodes: ['Young applicant cohort', 'Low BMI variance', 'No critical medical disclosure', 'Good payment propensity'],
        recommendation: 'Approve with wellness discount and annual payment nudging.'
      },
      {
        proposalId: 'UW-9833', applicantName: 'Manish Rao', product: 'Aegis Term Shield', predictedPremium: 31750,
        affordabilityScore: 64, riskScore: 59,
        reasonCodes: ['Smoker flag present', 'Family history of cardiac risk', 'High cover-to-income ratio'],
        recommendation: 'Approve after medical test and assign risk-adjusted premium.'
      },
      {
        proposalId: 'UW-9840', applicantName: 'Farhan Shaikh', product: 'Aegis Motor Protect', predictedPremium: 12600,
        affordabilityScore: 77, riskScore: 41,
        reasonCodes: ['Metro RTO risk', 'No prior claim record', 'Vehicle age under 3 years'],
        recommendation: 'Approve; recommend zero-dep add-on and anti-theft device discount.'
      }
    ];
  }

  getGovernanceMetrics(): AiGovernanceMetric[] {
    return [
      { label: 'Explainability Coverage', value: '100%', status: 'GOOD', description: 'Every AI decision includes reason codes and reviewer actions.' },
      { label: 'Bias Guardrail', value: 'Pass', status: 'GOOD', description: 'Protected attributes are excluded from pricing and claim decisions.' },
      { label: 'Manual Override Rate', value: '8.4%', status: 'WATCH', description: 'Within threshold; monitor vehicle claims from high-risk clusters.' },
      { label: 'PII Redaction', value: 'Active', status: 'GOOD', description: 'Aadhaar/PAN and medical identifiers are masked before AI analysis.' }
    ];
  }

  getAstraClaimCapabilities(): AiCapability[] {
    return [
      { keyword: 'RAG Pipeline', description: 'Retrieves policy clauses, claim history, and underwriting rules before answering.' },
      { keyword: 'Vector Embeddings', description: 'Uses semantic search over policy documents, claim notes, and SOP knowledge base.' },
      { keyword: 'Tool Calling', description: 'Routes questions to claim triage, premium simulation, fraud graph, or audit ledger tools.' },
      { keyword: 'Prompt Guardrails', description: 'Blocks unsafe decisions, masks PII, and forces human approval above risk thresholds.' },
      { keyword: 'PII Redaction', description: 'Masks Aadhaar, PAN, medical identifiers, and bank references before AI inference.' },
      { keyword: 'Observability', description: 'Captures p95 latency, confidence score, model version, drift signal, and audit reference.' },
      { keyword: 'Circuit Breaker', description: 'Falls back to deterministic rules if the AI provider becomes slow or unavailable.' },
      { keyword: 'Human-in-the-Loop', description: 'Escalates low-confidence or high-risk recommendations to an agent/admin reviewer.' }
    ];
  }

  getAstraClaimKnowledgeSources(): AiKnowledgeSource[] {
    return [
      { name: 'policy-clause-vector-index', type: 'VECTOR_INDEX', freshness: 'Updated 12 min ago', description: 'Semantic index for health, term, life, and vehicle policy clauses.' },
      { name: 'claim-risk-rule-engine', type: 'RULE_ENGINE', freshness: 'v2026.06.02', description: 'Deterministic rules for exclusions, waiting periods, duplicate bills, and SLA routing.' },
      { name: 'premium-payment-stream', type: 'TRANSACTION_STREAM', freshness: 'Near real-time', description: 'Kafka-style payment, renewal, refund, and failed debit event stream.' },
      { name: 'ai-audit-ledger', type: 'AUDIT_LEDGER', freshness: 'Append-only', description: 'Immutable trail for prompts, retrieval context, model output, overrides, and reviewer action.' },
      { name: 'customer-policy-store', type: 'POLICY_STORE', freshness: 'Transactional', description: 'Policy profile, nominee, claim, premium, and document metadata store.' }
    ];
  }

  getAstraClaimStarterPrompts(role: UserRole | null): string[] {
    if (role === 'ADMIN') {
      return [
        'Show today\'s high-risk claim backlog with reason codes and SLO impact',
        'Explain model drift, manual override rate, audit ledger and guardrail posture',
        'Draft an RCA for delayed claim settlement using p95 latency and queue depth'
      ];
    }
    if (role === 'AGENT') {
      return [
        'Find renewal-risk customers and suggest next-best-action using propensity scoring',
        'Explain why this proposal needs medical underwriting and risk-adjusted premium',
        'Prepare a customer-friendly claim document checklist with policy exclusions'
      ];
    }
    return [
      'Check my claim status and explain what document is missing',
      'Recommend the best policy upgrade using my cover amount and premium history',
      'Explain claim rejection reason in simple words with next action'
    ];
  }

  createAstraClaimOpeningMessage(role: UserRole | null): AiChatMessage {
    const roleLine = role === 'ADMIN'
      ? 'I can help with model governance, audit trails, fraud leakage, SLO burn-rate, override queue, and operational RCA.'
      : role === 'AGENT'
        ? 'I can help with underwriting signals, renewal propensity, cross-sell recommendations, document checklist, and customer follow-up scripts.'
        : 'I can help with claim status, policy recommendation, missing documents, settlement explanation, and premium guidance.';
    return {
      id: crypto.randomUUID(),
      sender: 'ASTRACLAIM',
      text: `I am AstraClaim AI ChatOps, a role-aware insurance copilot using RAG, vector embeddings, prompt guardrails, PII redaction, tool calling, and audit logging. ${roleLine}`,
      timestamp: new Date().toISOString(),
      intent: 'GENERAL',
      confidence: 96,
      retrievalContext: ['login-role-context', 'policy-store', 'claim-risk-rule-engine'],
      suggestedActions: this.getAstraClaimStarterPrompts(role),
      guardrails: ['PII masked before inference', 'No final rejection without human reviewer', 'Low-confidence answers require escalation'],
      toolTraces: [
        { toolName: 'RoleContextResolver', status: 'SUCCESS', latencyMs: 18, outputSummary: `Resolved portal role as ${role ?? 'UNKNOWN'}.` },
        { toolName: 'GuardrailPolicyLoader', status: 'SUCCESS', latencyMs: 25, outputSummary: 'Loaded PII, fairness, and claim-decision guardrails.' }
      ]
    };
  }

  askAstraClaim(prompt: string, role: UserRole | null): AiChatMessage {
    const lower = prompt.toLowerCase();
    let intent: AiChatIntent = 'GENERAL';
    let answer = '';
    let context: string[] = ['policy-clause-vector-index', 'customer-policy-store'];
    let actions: string[] = [];
    const traces: AiToolTrace[] = [
      { toolName: 'PromptClassifier', status: 'SUCCESS', latencyMs: 21, outputSummary: 'Classified user prompt and selected domain playbook.' },
      { toolName: 'PIIRedactionFilter', status: 'SUCCESS', latencyMs: 17, outputSummary: 'Masked Aadhaar, PAN, phone, email, and medical identifiers before inference.' }
    ];

    if (lower.includes('claim') || lower.includes('settlement') || lower.includes('document')) {
      intent = 'CLAIM_TRIAGE';
      context = ['claim-risk-rule-engine', 'policy-clause-vector-index', 'ai-audit-ledger'];
      traces.push({ toolName: 'ClaimTriageTool', status: 'SUCCESS', latencyMs: 92, outputSummary: 'Calculated risk band, missing documents, SLA, and next-best-action.' });
      answer = role === 'CUSTOMER'
        ? 'Your claim is analyzed through document completeness, policy coverage, waiting-period rules, duplicate-bill hash, provider network status, and SLA age. Current recommendation: request missing itemized bill and keep the claim in assisted review, not rejection.'
        : 'Claim triage should use riskScore, policy exclusion match, duplicate bill hash, provider trust score, claim velocity, and SLA burn-rate. Route LOW risk to STP, MEDIUM to document request, HIGH/CRITICAL to manual review with reason codes.';
      actions = ['Generate missing-document checklist', 'Open claim risk explanation', 'Create audit-ledger entry', 'Trigger human reviewer workflow'];
    } else if (lower.includes('fraud') || lower.includes('risk') || lower.includes('duplicate') || lower.includes('velocity')) {
      intent = 'FRAUD_ANALYSIS';
      context = ['fraud-signal-graph', 'premium-payment-stream', 'claim-risk-rule-engine'];
      traces.push({ toolName: 'FraudSignalGraph', status: 'SUCCESS', latencyMs: 118, outputSummary: 'Joined duplicate hashes, geo mismatch, provider anomaly, and claim velocity signals.' });
      answer = 'Fraud scoring combines duplicate document hash, repair-estimate variance, geo-tag mismatch, provider anomaly score, claim velocity counter, renewal proximity, and historical settlement pattern. Use graph-linked signals, not a single rule, so reviewers can explain the decision.';
      actions = ['Show graph-linked fraud signals', 'Escalate to SIU reviewer', 'Freeze auto-settlement', 'Compare against pin-code anomaly cluster'];
    } else if (lower.includes('underwriting') || lower.includes('premium') || lower.includes('proposal') || lower.includes('medical')) {
      intent = 'UNDERWRITING';
      context = ['underwriting-rule-engine', 'customer-policy-store', 'policy-clause-vector-index'];
      traces.push({ toolName: 'UnderwritingEvaluator', status: 'SUCCESS', latencyMs: 87, outputSummary: 'Predicted premium, affordability score, cover-to-income ratio, and reason codes.' });
      answer = 'Underwriting uses age band, smoker flag, BMI/medical disclosure, cover-to-income ratio, existing policies, previous claims, and affordability score. The AI should recommend pricing or medical tests, but final acceptance stays rule-backed and auditable.';
      actions = ['Calculate predicted premium', 'Explain risk-adjusted loading', 'Request medical test', 'Recommend lower cover or wellness add-on'];
    } else if (lower.includes('policy') || lower.includes('recommend') || lower.includes('upgrade') || lower.includes('cover')) {
      intent = 'POLICY_RECOMMENDATION';
      context = ['policy-clause-vector-index', 'customer-policy-store', 'premium-payment-stream'];
      traces.push({ toolName: 'PolicyRecommendationTool', status: 'SUCCESS', latencyMs: 74, outputSummary: 'Matched cover gap, payment behavior, tenure, and renewal propensity.' });
      answer = 'Policy recommendation is generated using cover gap analysis, premium affordability, claim history, life-stage signals, nominee profile, payment consistency, and product eligibility. The system should explain why a plan is recommended and which exclusions apply.';
      actions = ['Compare health vs term coverage', 'Show affordability simulation', 'Generate upgrade recommendation', 'Create customer explanation note'];
    } else if (lower.includes('drift') || lower.includes('audit') || lower.includes('guardrail') || lower.includes('bias') || lower.includes('compliance')) {
      intent = 'GOVERNANCE';
      context = ['ai-audit-ledger', 'model-monitoring-metrics', 'guardrail-policy-store'];
      traces.push({ toolName: 'GovernanceMonitor', status: 'SUCCESS', latencyMs: 64, outputSummary: 'Checked drift index, override rate, fairness guardrails, and explainability coverage.' });
      answer = 'Governance tracks prompt version, retrieval context, model confidence, manual override rate, drift index, protected-attribute exclusion, PII masking, and reviewer outcome. This makes the AI layer production-safe and defensible in audits.';
      actions = ['Open audit ledger', 'Review model drift dashboard', 'Export governance report', 'Escalate low-confidence decisions'];
    } else if (lower.includes('latency') || lower.includes('p95') || lower.includes('slo') || lower.includes('kafka') || lower.includes('redis') || lower.includes('circuit')) {
      intent = 'OPERATIONS';
      context = ['service-metrics', 'premium-payment-stream', 'redis-risk-cache', 'circuit-breaker-events'];
      traces.push({ toolName: 'OpsTelemetryTool', status: 'SUCCESS', latencyMs: 53, outputSummary: 'Read p95 latency, queue depth, Redis hit ratio, and circuit-breaker fallback events.' });
      answer = 'Operationally, protect the AI path with API gateway rate limiting, Redis-backed response cache, Kafka event replay for audit, circuit breaker fallback to rule engine, timeout budgets, SLO burn-rate alerts, and p95 latency monitoring.';
      actions = ['Show SLO burn-rate', 'Replay Kafka claim event', 'Inspect Redis cache hit ratio', 'Create RCA draft'];
    } else {
      traces.push({ toolName: 'SemanticRetriever', status: 'SUCCESS', latencyMs: 68, outputSummary: 'Retrieved closest insurance-domain knowledge chunks.' });
      answer = 'I can answer as an insurance-domain AI copilot. Ask about claim triage, underwriting, fraud scoring, policy recommendation, audit ledger, model drift, p95 latency, Redis cache, Kafka events, circuit breaker, or human-in-the-loop workflow.';
      actions = this.getAstraClaimStarterPrompts(role);
    }

    return {
      id: crypto.randomUUID(),
      sender: 'ASTRACLAIM',
      text: answer,
      timestamp: new Date().toISOString(),
      intent,
      confidence: this.intentConfidence(intent),
      retrievalContext: context,
      suggestedActions: actions,
      guardrails: ['PII redaction enabled', 'Hallucination guardrail: source-grounded answer only', 'Human approval required for final rejection or pricing exception'],
      toolTraces: traces
    };
  }

  private intentConfidence(intent: AiChatIntent): number {
    const scores: Record<AiChatIntent, number> = {
      CLAIM_TRIAGE: 93,
      UNDERWRITING: 90,
      FRAUD_ANALYSIS: 88,
      POLICY_RECOMMENDATION: 91,
      OPERATIONS: 89,
      GOVERNANCE: 92,
      GENERAL: 84
    };
    return scores[intent];
  }

}
