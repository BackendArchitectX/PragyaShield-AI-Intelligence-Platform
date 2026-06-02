import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { AdminDashboardStats } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Welcome -->
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:var(--radius-lg);padding:28px 32px;color:white;margin-bottom:28px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-20px;top:-20px;width:160px;height:160px;background:rgba(255,107,43,0.12);border-radius:50%"></div>
        <h2 style="font-size:22px;margin-bottom:6px;position:relative">Admin Dashboard 🏢</h2>
        <p style="opacity:0.7;font-size:13px;position:relative">Complete overview of PragyaShield Insurance operations</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid stagger">
        <div class="stat-card animate-fade-in">
          <div class="stat-icon blue"><span class="material-icons-outlined">groups</span></div>
          <div class="stat-details"><h4>Total Customers</h4><div class="value">{{ stats()?.totalCustomers }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon green"><span class="material-icons-outlined">verified_user</span></div>
          <div class="stat-details"><h4>Total Policies</h4><div class="value">{{ stats()?.totalPolicies }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon orange"><span class="material-icons-outlined">account_balance</span></div>
          <div class="stat-details"><h4>Total Revenue</h4><div class="value">{{ stats()?.totalRevenue | inr }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon yellow"><span class="material-icons-outlined">gavel</span></div>
          <div class="stat-details"><h4>Pending Claims</h4><div class="value" style="color:var(--warning)">{{ stats()?.pendingClaims }}</div></div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Claims Summary -->
        <div class="card">
          <div class="card-header">
            <h3>📊 Claims Summary</h3>
            <a routerLink="/admin/claims" class="btn btn-sm btn-outline">Review Claims</a>
          </div>
          <div class="card-body">
            <div style="display:flex;gap:16px;margin-bottom:20px">
              <div style="flex:1;text-align:center;padding:20px;background:var(--warning-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:800;color:#B8860B">{{ stats()?.pendingClaims }}</div>
                <div style="font-size:12px;color:#B8860B;font-weight:600">Pending</div>
              </div>
              <div style="flex:1;text-align:center;padding:20px;background:var(--success-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:800;color:var(--success)">{{ stats()?.claimsApproved }}</div>
                <div style="font-size:12px;color:var(--success);font-weight:600">Approved</div>
              </div>
              <div style="flex:1;text-align:center;padding:20px;background:var(--error-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:800;color:var(--error)">{{ stats()?.claimsRejected }}</div>
                <div style="font-size:12px;color:var(--error);font-weight:600">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Policy Distribution by Type -->
        <div class="card">
          <div class="card-header"><h3>📋 Policy Type Distribution</h3></div>
          <div class="card-body">
            @for (item of stats()?.policyTypeDistribution; track item.type) {
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                <span style="font-size:13px;font-weight:600;width:70px">{{ item.type }}</span>
                <div style="flex:1;height:24px;background:var(--bg);border-radius:12px;overflow:hidden">
                  <div [style.width.%]="getBarPercent(item.count)" style="height:100%;border-radius:12px;transition:width 0.6s"
                       [style.background]="getTypeColor(item.type)"></div>
                </div>
                <div style="text-align:right;min-width:80px">
                  <div style="font-size:14px;font-weight:700">{{ item.count }}</div>
                  <div style="font-size:11px;color:var(--text-muted)">{{ item.revenue | inr }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Monthly Collection Chart (CSS Bar Chart) -->
      <div class="card" style="margin-top:20px">
        <div class="card-header"><h3>💰 Monthly Premium Collection (FY 2024-25)</h3></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:8px;height:200px;padding-top:20px">
            @for (m of stats()?.monthlyPremiumCollection; track m.month) {
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%">
                <div style="flex:1;width:100%;display:flex;align-items:flex-end">
                  <div style="width:100%;border-radius:6px 6px 0 0;transition:height 0.6s ease;min-height:4px"
                       [style.height.%]="getChartHeight(m.amount)"
                       [style.background]="m.amount > 0 ? 'linear-gradient(180deg, var(--primary), var(--primary-light))' : 'var(--border-light)'"
                       [title]="(m.amount | inr)">
                  </div>
                </div>
                <div style="font-size:10px;font-weight:600;color:var(--text-muted);margin-top:8px">{{ m.month }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-top:24px;display:flex;gap:12px">
        <a routerLink="/admin/claims" class="btn btn-accent"><span class="material-icons-outlined" style="font-size:16px">gavel</span> Review Pending Claims</a>
        <a routerLink="/admin/policies" class="btn btn-outline"><span class="material-icons-outlined" style="font-size:16px">verified_user</span> Manage Policies</a>
        <a routerLink="/admin/agents" class="btn btn-outline"><span class="material-icons-outlined" style="font-size:16px">support_agent</span> Manage Agents</a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<AdminDashboardStats | null>(null);

  constructor(private mockData: MockDataService) {}

  ngOnInit() { this.stats.set(this.mockData.getAdminDashboard()); }

  getBarPercent(count: number): number {
    const max = Math.max(...(this.stats()?.policyTypeDistribution?.map(d => d.count) || [1]));
    return max > 0 ? (count / max) * 100 : 0;
  }

  getChartHeight(amount: number): number {
    const max = Math.max(...(this.stats()?.monthlyPremiumCollection?.map(m => m.amount) || [1]));
    return max > 0 ? Math.max((amount / max) * 100, amount > 0 ? 5 : 2) : 2;
  }

  getTypeColor(type: string): string {
    return { Life: '#7E57C2', Health: '#4CAF50', Term: '#42A5F5', Vehicle: '#FF9800' }[type] || '#999';
  }
}
