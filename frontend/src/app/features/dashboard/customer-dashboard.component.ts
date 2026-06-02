import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { DashboardStats } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Welcome Banner -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:var(--radius-lg);padding:28px 32px;color:white;margin-bottom:28px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-40px;top:-40px;width:200px;height:200px;background:rgba(255,107,43,0.15);border-radius:50%"></div>
        <div style="position:absolute;right:40px;bottom:-60px;width:150px;height:150px;background:rgba(255,255,255,0.05);border-radius:50%"></div>
        <h2 style="font-size:24px;margin-bottom:6px;position:relative">Welcome back, {{ getFirstName() }}! 👋</h2>
        <p style="opacity:0.8;font-size:14px;position:relative">Here's an overview of your insurance portfolio</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid stagger">
        <div class="stat-card animate-fade-in">
          <div class="stat-icon blue"><span class="material-icons-outlined">verified_user</span></div>
          <div class="stat-details">
            <h4>Active Policies</h4>
            <div class="value">{{ stats()?.activePolicies }} <span style="font-size:14px;color:var(--text-muted)">/ {{ stats()?.totalPolicies }}</span></div>
          </div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon green"><span class="material-icons-outlined">shield</span></div>
          <div class="stat-details">
            <h4>Total Cover</h4>
            <div class="value">{{ stats()?.totalCoverAmount | inr }}</div>
          </div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon orange"><span class="material-icons-outlined">payments</span></div>
          <div class="stat-details">
            <h4>Premium Paid</h4>
            <div class="value">{{ stats()?.totalPremiumPaid | inr }}</div>
          </div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon yellow"><span class="material-icons-outlined">pending_actions</span></div>
          <div class="stat-details">
            <h4>Pending Claims</h4>
            <div class="value">{{ stats()?.pendingClaims }}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Upcoming Payments -->
        <div class="card">
          <div class="card-header">
            <h3>📅 Upcoming Payments</h3>
            <a routerLink="/customer/transactions" class="btn btn-sm btn-outline">View All</a>
          </div>
          <div class="card-body" style="padding:0">
            @for (payment of stats()?.upcomingPayments; track payment.policyNumber) {
              <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid var(--border-light)">
                <div style="display:flex;align-items:center;gap:12px">
                  <span class="badge-policy-type" [class]="'badge-' + payment.type">{{ payment.type }}</span>
                  <div>
                    <div style="font-size:13px;font-weight:600">{{ payment.planName }}</div>
                    <div style="font-size:12px;color:var(--text-muted)">{{ payment.policyNumber }}</div>
                  </div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:15px;font-weight:700;color:var(--text-primary)">{{ payment.amount | inr }}</div>
                  <div style="font-size:11px;color:var(--warning);font-weight:600">Due: {{ payment.dueDate }}</div>
                </div>
              </div>
            }
            @empty {
              <div class="empty-state" style="padding:40px"><p>No upcoming payments</p></div>
            }
          </div>
        </div>

        <!-- Policy Distribution -->
        <div class="card">
          <div class="card-header">
            <h3>📊 Policy Distribution</h3>
          </div>
          <div class="card-body">
            @for (item of stats()?.policyDistribution; track item.type) {
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
                <div style="width:80px;font-size:13px;font-weight:600;color:var(--text-secondary)">{{ item.type }}</div>
                <div style="flex:1;height:28px;background:var(--bg);border-radius:14px;overflow:hidden;position:relative">
                  <div [style.width.%]="getBarWidth(item.count)" style="height:100%;border-radius:14px;transition:width 0.6s ease"
                       [style.background]="getBarColor(item.type)"></div>
                </div>
                <div style="font-size:16px;font-weight:700;width:24px;text-align:right">{{ item.count }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <h3>💳 Recent Transactions</h3>
          <a routerLink="/customer/transactions" class="btn btn-sm btn-outline">View All</a>
        </div>
        <div class="card-body" style="padding:0;overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (txn of stats()?.recentTransactions; track txn.id) {
                <tr>
                  <td style="font-family:monospace;font-size:12px">{{ txn.transactionId }}</td>
                  <td>{{ txn.policyNumber }}</td>
                  <td>{{ formatTxnType(txn.type) }}</td>
                  <td style="font-weight:700">{{ txn.totalAmount | inr }}</td>
                  <td>{{ txn.paymentMethod }}</td>
                  <td><span class="badge-status" [class]="'badge-' + txn.status.toLowerCase()">{{ txn.status }}</span></td>
                  <td>{{ txn.transactionDate }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-top:28px">
        <h3 style="font-size:16px;margin-bottom:16px">⚡ Quick Actions</h3>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <a routerLink="/customer/buy-policy" class="btn btn-accent" style="padding:14px 28px">
            <span class="material-icons-outlined" style="font-size:18px">add_shopping_cart</span>
            Buy New Policy
          </a>
          <a routerLink="/customer/file-claim" class="btn btn-outline" style="padding:14px 28px">
            <span class="material-icons-outlined" style="font-size:18px">note_add</span>
            File a Claim
          </a>
          <button class="btn btn-outline" style="padding:14px 28px">
            <span class="material-icons-outlined" style="font-size:18px">download</span>
            Download Policy Documents
          </button>
        </div>
      </div>
    </div>
  `
})
export class CustomerDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);

  constructor(public authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    const userId = this.authService.user()?.id || '';
    this.stats.set(this.mockData.getCustomerDashboard(userId));
  }

  formatTxnType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getFirstName(): string {
    const name = this.authService.user()?.fullName;
    return name ? name.split(' ')[0] : '';
  }

  getBarWidth(count: number): number {
    const max = Math.max(...(this.stats()?.policyDistribution?.map(d => d.count) || [1]));
    return max > 0 ? (count / max) * 100 : 0;
  }

  getBarColor(type: string): string {
    const colors: Record<string, string> = { 'Life': '#7E57C2', 'Health': '#4CAF50', 'Term': '#42A5F5', 'Vehicle': '#FF9800' };
    return colors[type] || '#999';
  }
}
