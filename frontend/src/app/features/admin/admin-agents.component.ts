import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { User, Policy } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-admin-agents',
  standalone: true,
  imports: [CommonModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div><h2>Agent Management</h2><p class="subtitle">{{ agents().length }} registered agents</p></div>
        <button class="btn btn-accent"><span class="material-icons-outlined" style="font-size:16px">person_add</span> Add New Agent</button>
      </div>

      <div class="policy-card-grid stagger">
        @for (agent of agents(); track agent.user.id) {
          <div class="card animate-fade-in">
            <div class="card-body">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
                <div class="user-avatar" style="width:52px;height:52px;font-size:18px;background:linear-gradient(135deg,var(--primary),var(--primary-light))">
                  {{ agent.user.fullName.split(' ').map(getFirstChar).join('').substring(0,2) }}
                </div>
                <div style="flex:1">
                  <h4 style="font-size:16px;margin-bottom:2px">{{ agent.user.fullName }}</h4>
                  <div style="font-size:12px;color:var(--text-muted)">{{ agent.user.agentCode }} • {{ agent.user.city }}, {{ agent.user.state }}</div>
                </div>
                <span class="badge-status badge-active">Active</span>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
                <div style="text-align:center;padding:12px;background:var(--bg);border-radius:var(--radius-sm)">
                  <div style="font-size:20px;font-weight:800;color:var(--primary)">{{ agent.policiesSold }}</div>
                  <div style="font-size:11px;color:var(--text-muted);font-weight:600">Policies</div>
                </div>
                <div style="text-align:center;padding:12px;background:var(--bg);border-radius:var(--radius-sm)">
                  <div style="font-size:20px;font-weight:800;color:var(--success)">{{ agent.customers }}</div>
                  <div style="font-size:11px;color:var(--text-muted);font-weight:600">Customers</div>
                </div>
                <div style="text-align:center;padding:12px;background:var(--bg);border-radius:var(--radius-sm)">
                  <div style="font-size:20px;font-weight:800;color:var(--accent)">{{ agent.totalPremium | inr }}</div>
                  <div style="font-size:11px;color:var(--text-muted);font-weight:600">Premium</div>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
                <span class="material-icons-outlined" style="font-size:16px;color:var(--text-muted)">email</span>
                <span style="font-size:13px">{{ agent.user.email }}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
                <span class="material-icons-outlined" style="font-size:16px;color:var(--text-muted)">phone</span>
                <span style="font-size:13px">{{ agent.user.phone }}</span>
              </div>

              <div style="display:flex;gap:8px">
                <button class="btn btn-sm btn-outline" style="flex:1">View Details</button>
                <button class="btn btn-sm btn-outline" style="color:var(--warning)">
                  <span class="material-icons-outlined" style="font-size:14px">edit</span>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (agents().length === 0) {
        <div class="empty-state"><div class="icon">👥</div><h3>No Agents Found</h3></div>
      }
    </div>
  `
})
export class AdminAgentsComponent implements OnInit {
  agents = signal<{ user: User; policiesSold: number; customers: number; totalPremium: number }[]>([]);

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    const allUsers = this.mockData.getUsers().filter(u => u.role === 'AGENT');
    const agentList = allUsers.map(user => {
      const policies = this.mockData.getPoliciesByAgent(user.id);
      const customerIds = new Set(policies.map(p => p.customerId));
      return {
        user,
        policiesSold: policies.length,
        customers: customerIds.size,
        totalPremium: policies.reduce((s, p) => s + p.premiumAmount, 0)
      };
    });
    this.agents.set(agentList);
  }

  getFirstChar = (s: string) => s[0];
}
