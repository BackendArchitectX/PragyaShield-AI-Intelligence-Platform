import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <!-- Left: Branding -->
      <div class="login-branding">
        <div class="logo-icon">🧠</div>
        <h1>PragyaShield Intelligence</h1>
        <p class="tagline">Enterprise AI Insurance Platform</p>
        <div class="login-features">
          <div class="feature-item">
            <div class="feature-icon">❤️</div>
            <span>AstraClaim AI ChatOps chatbot with RAG, vector embeddings and tool-calling traces</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🏥</div>
            <span>Claim triage, fraud graph, document intelligence and human-in-the-loop review</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🚗</div>
            <span>Fraud signal graph with human-in-the-loop decisions</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <span>Kafka event replay, Redis risk cache, circuit breaker fallback and p95 SLO dashboard</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📋</div>
            <span>Prompt guardrails, PII redaction, model drift monitoring and immutable audit ledger</span>
          </div>
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="login-form-container">
        <div class="login-card animate-fade-in">
          <h2>Welcome Back</h2>
          <p class="subtitle">Sign in to operate the AI-powered insurance platform</p>

          <!-- Role Tabs -->
          <div class="role-tabs">
            <button class="role-tab" [class.active]="selectedRole() === 'CUSTOMER'" (click)="selectRole('CUSTOMER')">
              <span class="material-icons-outlined" style="font-size:16px">person</span>
              Customer
            </button>
            <button class="role-tab" [class.active]="selectedRole() === 'AGENT'" (click)="selectRole('AGENT')">
              <span class="material-icons-outlined" style="font-size:16px">support_agent</span>
              Agent
            </button>
            <button class="role-tab" [class.active]="selectedRole() === 'ADMIN'" (click)="selectRole('ADMIN')">
              <span class="material-icons-outlined" style="font-size:16px">admin_panel_settings</span>
              Admin
            </button>
          </div>

          <!-- Error Message -->
          @if (errorMsg()) {
            <div class="alert alert-error">
              <span class="material-icons-outlined" style="font-size:18px">error_outline</span>
              {{ errorMsg() }}
            </div>
          }

          <!-- Login Form -->
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email"
                   [placeholder]="getPlaceholderEmail()" autocomplete="email">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input [type]="showPassword() ? 'text' : 'password'" class="form-control"
                   [(ngModel)]="password" placeholder="Enter your password"
                   (keyup.enter)="login()" autocomplete="current-password">
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-secondary);cursor:pointer">
              <input type="checkbox" [checked]="showPassword()" (change)="showPassword.set(!showPassword())">
              Show Password
            </label>
            <a href="#" style="font-size:13px;color:var(--primary);font-weight:600">Forgot Password?</a>
          </div>

          <button class="btn btn-primary" (click)="login()" [disabled]="isLoading()">
            @if (isLoading()) {
              <span>Signing in...</span>
            } @else {
              <span class="material-icons-outlined" style="font-size:18px">login</span>
              Sign In as {{ selectedRole() | titlecase }}
            }
          </button>

          <!-- Demo Credentials -->
          <div class="demo-creds">
            <h4>🔑 Demo Credentials</h4>
            @for (cred of authService.demoCredentials; track cred.email) {
              <div class="cred-row" (click)="fillCredentials(cred.email, cred.role)" style="cursor:pointer;border-radius:4px;padding:5px 4px;" [style.background]="cred.role === selectedRole() ? 'white' : 'transparent'">
                <span class="cred-label">{{ cred.role | titlecase }}</span>
                <code>{{ cred.email }}</code>
                <code>{{ getPassword(cred.role) }}</code>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  selectedRole = signal<UserRole>('CUSTOMER');
  email = '';
  password = '';
  errorMsg = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(public authService: AuthService, private router: Router) {
    if (authService.loggedIn()) {
      this.router.navigate([authService.getDashboardRoute()]);
    }
    this.email = 'rajesh@email.com';
    this.password = 'customer123';
  }

  selectRole(role: UserRole) {
    this.selectedRole.set(role);
    this.errorMsg.set('');
    const cred = this.authService.demoCredentials.find(c => c.role === role);
    if (cred) {
      this.email = cred.email;
      this.password = this.getPassword(role);
    }
  }

  fillCredentials(email: string, role: UserRole) {
    this.selectedRole.set(role);
    this.email = email;
    this.password = this.getPassword(role);
    this.errorMsg.set('');
  }

  getPassword(role: UserRole): string {
    switch (role) {
      case 'CUSTOMER': return 'customer123';
      case 'AGENT': return 'agent123';
      case 'ADMIN': return 'admin123';
    }
  }

  getPlaceholderEmail(): string {
    const cred = this.authService.demoCredentials.find(c => c.role === this.selectedRole());
    return cred?.email || 'Enter email';
  }

  login() {
    this.errorMsg.set('');
    if (!this.email || !this.password) {
      this.errorMsg.set('Please enter email and password.');
      return;
    }
    this.isLoading.set(true);
    setTimeout(() => {
      const result = this.authService.login({
        email: this.email,
        password: this.password,
        role: this.selectedRole()
      });
      this.isLoading.set(false);
      if (result.success) {
        this.router.navigate([this.authService.getDashboardRoute()]);
      } else {
        this.errorMsg.set(result.message);
      }
    }, 800);
  }
}
