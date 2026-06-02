import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AiIntelligenceService } from '../../core/services/ai-intelligence.service';
import { AuthService } from '../../core/services/auth.service';
import { AiChatMessage } from '../../core/models/models';

@Component({
  selector: 'app-astra-claim-floating-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="floating-ai-shell" [class.open]="open()">
      @if (!open()) {
        <button class="floating-ai-launcher" type="button" (click)="toggle()" aria-label="Open AstraClaim AI Chatbot">
          <span class="pulse-ring"></span>
          <span class="material-icons-outlined">smart_toy</span>
          <div>
            <strong>AstraClaim</strong>
            <small>AI Chatbot</small>
          </div>
        </button>
      }

      @if (open()) {
        <div class="floating-ai-panel">
          <header>
            <div>
              <strong>AstraClaim AI ChatOps</strong>
              <small>RAG • Tool Calling • Guardrails • Audit Ledger</small>
            </div>
            <button type="button" (click)="toggle()"><span class="material-icons-outlined">close</span></button>
          </header>

          <div class="floating-ai-runtime">
            <span>role={{ auth.userRole() }}</span>
            <span>model=insurance-rag-v2</span>
            <span>p95=184ms</span>
          </div>

          <div class="floating-ai-messages">
            @for (message of messages(); track message.id) {
              <article [class.user]="message.sender === 'USER'" [class.bot]="message.sender === 'ASTRACLAIM'">
                <strong>{{ message.sender === 'USER' ? 'You' : 'AstraClaim' }}</strong>
                <p>{{ message.text }}</p>
                @if (message.intent) {
                  <small>{{ message.intent }} • confidence {{ message.confidence }}%</small>
                }
              </article>
            }
          </div>

          <div class="floating-ai-suggestions">
            @for (prompt of suggestions(); track prompt) {
              <button type="button" (click)="ask(prompt)">{{ prompt }}</button>
            }
          </div>

          <form class="floating-ai-input" (ngSubmit)="askTyped()">
            <input [(ngModel)]="prompt" name="prompt" placeholder="Ask claim, policy, underwriting, fraud, Kafka, Redis..." />
            <button type="submit"><span class="material-icons-outlined">send</span></button>
          </form>

          <a class="floating-ai-full" [routerLink]="fullChatRoute()">Open full AI chatbot console →</a>
        </div>
      }
    </section>
  `
})
export class AstraClaimFloatingChatComponent {
  open = signal(false);
  prompt = '';
  messages = signal<AiChatMessage[]>([
    this.ai.createAstraClaimOpeningMessage(this.auth.userRole())
  ]);
  suggestions = signal<string[]>([
    'Triage claim with reason codes',
    'Explain fraud risk graph',
    'Check p95 latency and SLO burn-rate'
  ]);

  constructor(private ai: AiIntelligenceService, public auth: AuthService) {}

  toggle(): void {
    this.open.update(value => !value);
  }

  askTyped(): void {
    const value = this.prompt.trim();
    if (!value) return;
    this.ask(value);
    this.prompt = '';
  }

  ask(value: string): void {
    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),
      sender: 'USER',
      text: value,
      timestamp: new Date().toISOString()
    };
    const botMessage = this.ai.askAstraClaim(value, this.auth.userRole());
    this.messages.update(current => [...current.slice(-4), userMessage, botMessage]);
  }

  fullChatRoute(): string {
    const role = this.auth.userRole()?.toLowerCase() || 'customer';
    return `/${role}/astraclaim-chatops`;
  }
}
