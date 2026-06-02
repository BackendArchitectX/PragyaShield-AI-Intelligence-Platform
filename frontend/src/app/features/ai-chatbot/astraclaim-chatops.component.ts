import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AiIntelligenceService } from '../../core/services/ai-intelligence.service';
import { AiCapability, AiChatMessage, AiKnowledgeSource } from '../../core/models/models';

@Component({
  selector: 'app-astraclaim-chatops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatops-page animate-fade-in">
      <section class="chatops-hero">
        <div>
          <div class="eyebrow"><span class="material-icons-outlined">smart_toy</span> AI Chatbot + Technical Copilot</div>
          <h2>AstraClaim AI ChatOps</h2>
          <p>
            Role-aware insurance chatbot built over RAG, vector embeddings, semantic search, prompt guardrails,
            PII redaction, tool calling, audit ledger, Redis cache, Kafka event context, and human-in-the-loop review.
          </p>
          <div class="chatops-badges">
            @for (capability of capabilities; track capability.keyword) {
              <span>{{ capability.keyword }}</span>
            }
          </div>
        </div>
        <div class="chatops-terminal">
          <div class="terminal-header"><i></i><i></i><i></i><strong>astraclaim-rag-runtime</strong></div>
          <pre>POST /api/ai/astraclaim/chat
model: insurance-rag-v1
routing: role-aware
guardrails: pii_masking + audit_required
fallback: deterministic_rule_engine</pre>
        </div>
      </section>

      <div class="chatops-layout">
        <section class="chat-shell card">
          <div class="chat-header">
            <div>
              <h3>AstraClaim Conversation Console</h3>
              <p>{{ roleSummary() }}</p>
            </div>
            <div class="runtime-chip"><span class="material-icons-outlined">memory</span> {{ selectedRuntime() }}</div>
          </div>

          <div class="chat-window" #chatWindow>
            @for (message of messages(); track message.id) {
              <article class="chat-message" [class.user]="message.sender === 'USER'" [class.bot]="message.sender === 'ASTRACLAIM'">
                <div class="message-avatar">{{ message.sender === 'USER' ? userInitials() : 'NG' }}</div>
                <div class="message-bubble">
                  <div class="message-top">
                    <strong>{{ message.sender === 'USER' ? 'You' : 'AstraClaim AI ChatOps' }}</strong>
                    <small>{{ message.timestamp | date:'shortTime' }}</small>
                  </div>
                  <p>{{ message.text }}</p>

                  @if (message.intent) {
                    <div class="message-meta">
                      <span>Intent: {{ message.intent }}</span>
                      <span>Confidence: {{ message.confidence }}%</span>
                    </div>
                  }

                  @if (message.retrievalContext?.length) {
                    <div class="context-chips">
                      @for (ctx of message.retrievalContext || []; track ctx) {
                        <span>{{ ctx }}</span>
                      }
                    </div>
                  }

                  @if (message.suggestedActions?.length) {
                    <div class="suggested-actions">
                      <b>Suggested actions</b>
                      @for (action of message.suggestedActions || []; track action) {
                        <button type="button" (click)="sendPrompt(action)">{{ action }}</button>
                      }
                    </div>
                  }

                  @if (message.toolTraces?.length) {
                    <details class="tool-trace">
                      <summary>Tool-calling trace</summary>
                      @for (trace of message.toolTraces || []; track trace.toolName + trace.outputSummary) {
                        <div class="trace-row">
                          <span>{{ trace.toolName }}</span>
                          <b>{{ trace.status }}</b>
                          <small>{{ trace.latencyMs }}ms</small>
                          <p>{{ trace.outputSummary }}</p>
                        </div>
                      }
                    </details>
                  }

                  @if (message.guardrails?.length) {
                    <div class="guardrail-strip">
                      @for (guardrail of message.guardrails || []; track guardrail) {
                        <span><i class="material-icons-outlined">policy</i>{{ guardrail }}</span>
                      }
                    </div>
                  }
                </div>
              </article>
            }
          </div>

          <div class="prompt-lab">
            <label>Prompt Lab</label>
            <textarea [(ngModel)]="prompt" rows="3" placeholder="Ask about claim triage, fraud scoring, underwriting, audit ledger, Kafka event replay, Redis cache, p95 latency, SLO burn-rate..."></textarea>
            <div class="prompt-actions">
              <select [(ngModel)]="runtimeMode">
                <option value="RAG + Tool Calling">RAG + Tool Calling</option>
                <option value="Rules Fallback">Rules Fallback</option>
                <option value="Governance Mode">Governance Mode</option>
              </select>
              <button class="btn btn-accent" type="button" (click)="sendCurrentPrompt()">
                <span class="material-icons-outlined">send</span> Ask AstraClaim
              </button>
            </div>
          </div>
        </section>

        <aside class="chatops-side">
          <section class="card">
            <div class="card-header"><h3>Technical Keywords</h3></div>
            <div class="card-body keyword-list">
              @for (capability of capabilities; track capability.keyword) {
                <div class="keyword-card">
                  <strong>{{ capability.keyword }}</strong>
                  <p>{{ capability.description }}</p>
                </div>
              }
            </div>
          </section>

          <section class="card">
            <div class="card-header"><h3>Knowledge Sources</h3></div>
            <div class="card-body source-list">
              @for (source of knowledgeSources; track source.name) {
                <div class="source-row">
                  <div>
                    <strong>{{ source.name }}</strong>
                    <p>{{ source.description }}</p>
                  </div>
                  <span>{{ source.type }}</span>
                  <small>{{ source.freshness }}</small>
                </div>
              }
            </div>
          </section>

          <section class="card">
            <div class="card-header"><h3>Starter Prompts</h3></div>
            <div class="card-body starter-list">
              @for (starter of starterPrompts(); track starter) {
                <button type="button" (click)="sendPrompt(starter)">{{ starter }}</button>
              }
            </div>
          </section>
        </aside>
      </div>
    </div>
  `
})
export class AstraClaimChatOpsComponent {
  prompt = '';
  runtimeMode = 'RAG + Tool Calling';
  capabilities: AiCapability[] = this.ai.getAstraClaimCapabilities();
  knowledgeSources: AiKnowledgeSource[] = this.ai.getAstraClaimKnowledgeSources();
  messages = signal<AiChatMessage[]>([
    this.ai.createAstraClaimOpeningMessage(this.authService.userRole())
  ]);
  starterPrompts = computed(() => this.ai.getAstraClaimStarterPrompts(this.authService.userRole()));

  constructor(private ai: AiIntelligenceService, public authService: AuthService) {}

  selectedRuntime(): string {
    return this.runtimeMode;
  }

  userInitials(): string {
    const name = this.authService.user()?.fullName || 'User';
    return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  }

  roleSummary(): string {
    const role = this.authService.userRole();
    if (role === 'ADMIN') return 'Admin mode: governance, audit ledger, model drift, queue depth, p95 latency, override analytics.';
    if (role === 'AGENT') return 'Agent mode: underwriting, renewal propensity, customer follow-up, document checklist, next-best-action.';
    return 'Customer mode: claim status, policy explanation, missing documents, settlement guidance, premium assistance.';
  }

  sendCurrentPrompt(): void {
    const value = this.prompt.trim();
    if (!value) return;
    this.sendPrompt(value);
    this.prompt = '';
  }

  sendPrompt(value: string): void {
    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),
      sender: 'USER',
      text: value,
      timestamp: new Date().toISOString()
    };
    const botMessage = this.ai.askAstraClaim(value, this.authService.userRole());
    this.messages.update(messages => [...messages, userMessage, botMessage]);
  }
}
