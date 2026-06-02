import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AiIntelligenceService } from '../../core/services/ai-intelligence.service';
import { AiClaimInsight, AiDecision, AiRiskBand } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-ai-command-center',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe],
  template: `
    <div class="ai-page animate-fade-in">
      <section class="ai-hero">
        <div>
          <div class="eyebrow"><span class="material-icons-outlined">auto_awesome</span> AI Platform Layer</div>
          <h2>PragyaShield AI Command Center</h2>
          <p>
            A human-in-the-loop insurance intelligence layer for claim triage, underwriting, fraud detection,
            renewal propensity, explainability, and governance. The existing Customer, Agent, and Admin login options remain unchanged.
          </p>
          <div class="ai-hero-actions">
            <button class="btn btn-accent" (click)="runSimulation()"><span class="material-icons-outlined">play_arrow</span> Run AI Simulation</button>
            <button class="btn btn-outline" (click)="toggleArchitecture()"><span class="material-icons-outlined">account_tree</span> Architecture View</button>
          </div>
        </div>
        <div class="ai-orbit-card">
          <div class="orbit-core">AI</div>
          <span class="orbit-node n1">Risk</span>
          <span class="orbit-node n2">Fraud</span>
          <span class="orbit-node n3">Claims</span>
          <span class="orbit-node n4">Audit</span>
        </div>
      </section>

      <div class="ai-role-banner">
        <span class="material-icons-outlined">verified_user</span>
        <div>
          <strong>{{ roleTitle() }}</strong>
          <p>{{ roleNarrative() }}</p>
        </div>
      </div>

      <div class="ai-metric-grid">
        @for (metric of executiveMetrics; track metric.label) {
          <div class="ai-metric-card" [class.warning]="metric.tone === 'warning'">
            <div class="metric-icon"><span class="material-icons-outlined">{{ metric.icon }}</span></div>
            <div>
              <p>{{ metric.label }}</p>
              <h3>{{ metric.value }}</h3>
              <small>{{ metric.change }}</small>
            </div>
          </div>
        }
      </div>

      @if (showArchitecture()) {
        <section class="card ai-architecture">
          <div class="card-header"><h3>Reference Architecture</h3></div>
          <div class="card-body">
            <div class="architecture-flow">
              <div>Angular Portal<br><small>Customer / Agent / Admin</small></div>
              <span>→</span>
              <div>API Gateway<br><small>Auth, rate limit, audit</small></div>
              <span>→</span>
              <div>Spring Boot Services<br><small>Claims, Policy, User</small></div>
              <span>→</span>
              <div>AI Decision Layer<br><small>LLM + ML rules + guardrails</small></div>
              <span>→</span>
              <div>Human Review<br><small>Explainability + override</small></div>
            </div>
          </div>
        </section>
      }

      <div class="grid-2 ai-grid-main">
        <section class="card">
          <div class="card-header">
            <h3>AI Claim Triage Queue</h3>
            <select class="form-control compact" [(ngModel)]="selectedBand">
              <option value="ALL">All Risk Bands</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div class="card-body triage-list">
            @for (claim of filteredClaims(); track claim.claimId) {
              <article class="triage-card" [class.high]="claim.riskBand === 'HIGH' || claim.riskBand === 'CRITICAL'">
                <div class="triage-top">
                  <div>
                    <strong>{{ claim.claimNumber }}</strong>
                    <p>{{ claim.customerName }} • {{ claim.policyType }} • {{ claim.claimAmount | inr }}</p>
                  </div>
                  <div class="risk-pill" [ngClass]="claim.riskBand.toLowerCase()">{{ claim.riskBand }} {{ claim.riskScore }}</div>
                </div>
                <div class="confidence-row"><span>Model confidence</span><div><i [style.width.%]="claim.confidence"></i></div><b>{{ claim.confidence }}%</b></div>
                <div class="decision-row">
                  <span class="decision-chip">{{ decisionLabel(claim.recommendedDecision) }}</span>
                  <small>{{ claim.slaHoursRemaining }}h SLA remaining</small>
                </div>
                <details>
                  <summary>Explainability and next actions</summary>
                  <div class="explain-grid">
                    <div><b>Reason codes</b><ul><li *ngFor="let reason of claim.explainability">{{ reason }}</li></ul></div>
                    <div><b>Actions</b><ul><li *ngFor="let action of claim.nextBestActions">{{ action }}</li></ul></div>
                  </div>
                </details>
              </article>
            }
          </div>
        </section>

        <section class="card">
          <div class="card-header"><h3>Underwriting Copilot</h3></div>
          <div class="card-body underwriting-list">
            @for (item of underwritingSignals; track item.proposalId) {
              <div class="uw-card">
                <div class="uw-header"><strong>{{ item.applicantName }}</strong><span>{{ item.proposalId }}</span></div>
                <p>{{ item.product }}</p>
                <div class="uw-bars">
                  <label>Affordability <b>{{ item.affordabilityScore }}%</b></label>
                  <div><i [style.width.%]="item.affordabilityScore"></i></div>
                  <label>Risk <b>{{ item.riskScore }}%</b></label>
                  <div><i [style.width.%]="item.riskScore"></i></div>
                </div>
                <div class="premium">Predicted premium: <b>{{ item.predictedPremium | inr }}</b></div>
                <small>{{ item.recommendation }}</small>
              </div>
            }
          </div>
        </section>
      </div>

      <div class="grid-2">
        <section class="card fraud-graph-card">
          <div class="card-header"><h3>Fraud Signal Graph</h3></div>
          <div class="card-body">
            <div class="fraud-graph">
              <span class="graph-node root">Claim</span>
              <span class="graph-node a">Hospital</span>
              <span class="graph-node b">Policy</span>
              <span class="graph-node c">Device</span>
              <span class="graph-node d">Pincode</span>
              <span class="graph-line l1"></span><span class="graph-line l2"></span><span class="graph-line l3"></span><span class="graph-line l4"></span>
            </div>
            <p class="graph-caption">Detects collusive patterns across provider, policy, customer device, location, and repeated claim hashes.</p>
          </div>
        </section>

        <section class="card">
          <div class="card-header"><h3>AI Governance Board</h3></div>
          <div class="card-body governance-list">
            @for (metric of governanceMetrics; track metric.label) {
              <div class="governance-row" [class.watch]="metric.status === 'WATCH'" [class.risk]="metric.status === 'RISK'">
                <div><strong>{{ metric.label }}</strong><p>{{ metric.description }}</p></div>
                <span>{{ metric.value }}</span>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `
})
export class AiCommandCenterComponent {
  selectedBand: AiRiskBand | 'ALL' = 'ALL';
  showArchitecture = signal(false);
  executiveMetrics = this.ai.getExecutiveMetrics();
  claimInsights = this.ai.getClaimInsights();
  underwritingSignals = this.ai.getUnderwritingSignals();
  governanceMetrics = this.ai.getGovernanceMetrics();

  filteredClaims(): AiClaimInsight[] {
    return this.selectedBand === 'ALL'
      ? this.claimInsights
      : this.claimInsights.filter(c => c.riskBand === this.selectedBand);
  }

  constructor(private ai: AiIntelligenceService, public authService: AuthService) {}

  roleTitle(): string {
    const role = this.authService.userRole();
    if (role === 'ADMIN') return 'Admin AI control plane';
    if (role === 'AGENT') return 'Agent next-best-action workspace';
    return 'Customer AI service assistant';
  }

  roleNarrative(): string {
    const role = this.authService.userRole();
    if (role === 'ADMIN') return 'Monitor model drift, claims leakage, override rate, governance posture, and enterprise SLAs.';
    if (role === 'AGENT') return 'Prioritize leads, renewal risk, cross-sell opportunities, and proposal underwriting signals.';
    return 'View personalized claim guidance, policy recommendations, document checklist, and settlement status intelligence.';
  }

  runSimulation(): void {
    this.executiveMetrics = [
      { label: 'AI Straight-Through Processing', value: '76%', change: '+4% simulated uplift', tone: 'positive', icon: 'bolt' },
      { label: 'Fraud Leakage Prevented', value: '₹3.1Cr', change: '+₹30L scenario impact', tone: 'positive', icon: 'shield' },
      { label: 'Human Review Queue', value: '15', change: '4 cases auto-cleared', tone: 'positive', icon: 'fact_check' },
      { label: 'Model Drift Index', value: '0.06', change: 'stable after recalibration', tone: 'neutral', icon: 'monitor_heart' }
    ];
  }

  toggleArchitecture(): void { this.showArchitecture.set(!this.showArchitecture()); }

  decisionLabel(decision: AiDecision): string {
    return decision.replaceAll('_', ' ');
  }
}
