import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Policy, User } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-agent-customers',
  standalone: true,
  imports: [CommonModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div><h2>My Customers</h2><p class="subtitle">{{ customers().length }} customers managed</p></div>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer</th><th>Email</th><th>Phone</th><th>City</th><th>Policies</th><th>Total Cover</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (c of customers(); track c.user.id) {
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="user-avatar" style="width:34px;height:34px;font-size:12px">{{ c.user.fullName.split(' ').map(getFirstChar).join('').substring(0,2) }}</div>
                      <div>
                        <div style="font-weight:600;font-size:13px">{{ c.user.fullName }}</div>
                        <div style="font-size:11px;color:var(--text-muted)">ID: {{ c.user.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ c.user.email }}</td>
                  <td>{{ c.user.phone }}</td>
                  <td>{{ c.user.city }}</td>
                  <td><span style="font-weight:700">{{ c.policies.length }}</span></td>
                  <td style="font-weight:700">{{ c.totalCover | inr }}</td>
                  <td><span class="badge-status badge-active">Active</span></td>
                </tr>
              }
            </tbody>
          </table>
          @if (customers().length === 0) {
            <div class="empty-state"><div class="icon">👥</div><h3>No Customers Yet</h3></div>
          }
        </div>
      </div>
    </div>
  `
})
export class AgentCustomersComponent implements OnInit {
  customers = signal<{ user: User; policies: Policy[]; totalCover: number }[]>([]);

  constructor(private authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    const agentId = this.authService.user()?.id || '';
    const agentPolicies = this.mockData.getPoliciesByAgent(agentId);
    const customerIds = [...new Set(agentPolicies.map(p => p.customerId))];
    const list = customerIds.map(cid => {
      const user = this.mockData.getUserById(cid)!;
      const policies = agentPolicies.filter(p => p.customerId === cid);
      return { user, policies, totalCover: policies.reduce((s, p) => s + p.coverAmount, 0) };
    });
    this.customers.set(list);
  }

  getFirstChar = (s: string) => s[0];
}
