import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { AgentDashboardStats } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Welcome -->
      <div style="background:linear-gradient(135deg,#004080,#001f3f);border-radius:var(--radius-lg);padding:28px 32px;color:white;margin-bottom:28px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-30px;top:-30px;width:180px;height:180px;background:rgba(255,107,43,0.15);border-radius:50%"></div>
        <h2 style="font-size:22px;margin-bottom:6px;position:relative">Welcome, {{ authService.user()?.fullName }}! 💼</h2>
        <p style="opacity:0.7;font-size:13px;position:relative">Agent Code: {{ authService.user()?.agentCode }} • Here's your performance overview</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid stagger">
        <div class="stat-card animate-fade-in">
          <div class="stat-icon blue"><span class="material-icons-outlined">groups</span></div>
          <div class="stat-details"><h4>Total Customers</h4><div class="value">{{ stats()?.totalCustomers }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon green"><span class="material-icons-outlined">verified_user</span></div>
          <div class="stat-details"><h4>Policies Sold</h4><div class="value">{{ stats()?.policiesSold }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon orange"><span class="material-icons-outlined">payments</span></div>
          <div class="stat-details"><h4>Commission Earned</h4><div class="value">{{ stats()?.commissionEarned | inr }}</div></div>
        </div>
        <div class="stat-card animate-fade-in">
          <div class="stat-icon yellow"><span class="material-icons-outlined">pending</span></div>
          <div class="stat-details"><h4>Pending Proposals</h4><div class="value">{{ stats()?.pendingProposals }}</div></div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Monthly Target -->
        <div class="card">
          <div class="card-header"><h3>🎯 Monthly Target</h3></div>
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px">
              <span style="font-size:13px;color:var(--text-secondary)">Achieved</span>
              <span style="font-size:14px;font-weight:700">{{ stats()?.monthlyAchieved | inr }} / {{ stats()?.monthlyTarget | inr }}</span>
            </div>
            <div style="height:16px;background:var(--bg);border-radius:8px;overflow:hidden;margin-bottom:8px">
              <div style="height:100%;border-radius:8px;background:linear-gradient(90deg,var(--success),#66BB6A);transition:width 0.8s ease"
                   [style.width.%]="getTargetPercent()"></div>
            </div>
            <div style="font-size:12px;color:var(--text-muted);text-align:right">{{ getTargetPercent() }}% of target achieved</div>
          </div>
        </div>

        <!-- Top Plans -->
        <div class="card">
          <div class="card-header"><h3>🏆 Top Selling Plans</h3></div>
          <div class="card-body" style="padding:0">
            @for (plan of stats()?.topPlans; track plan.name; let i = $index) {
              <div style="display:flex;align-items:center;gap:12px;padding:14px 24px;border-bottom:1px solid var(--border-light)">
                <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700"
                     [style.background]="i === 0 ? '#FFF3E0' : i === 1 ? '#F5F5F5' : '#FFF8E1'"
                     [style.color]="i === 0 ? '#E65100' : i === 1 ? '#616161' : '#F57F17'">
                  {{ i + 1 }}
                </div>
                <span style="flex:1;font-size:13px;font-weight:600">{{ plan.name }}</span>
                <span style="font-size:14px;font-weight:700;color:var(--primary)">{{ plan.count }} sold</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  stats = signal<AgentDashboardStats | null>(null);

  constructor(public authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    this.stats.set(this.mockData.getAgentDashboard(this.authService.user()?.id || ''));
  }

  getTargetPercent(): number {
    const s = this.stats();
    if (!s || !s.monthlyTarget) return 0;
    return Math.round((s.monthlyAchieved / s.monthlyTarget) * 100);
  }
}
