import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Policy, PolicyType, PolicyStatus } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div>
          <h2>{{ isAdmin ? 'All Policies' : isAgent ? 'Policies Sold' : 'My Policies' }}</h2>
          <p class="subtitle">{{ filteredPolicies().length }} policies found</p>
        </div>
        @if (!isAdmin && !isAgent) {
          <a routerLink="/customer/buy-policy" class="btn btn-accent">
            <span class="material-icons-outlined" style="font-size:18px">add</span>
            Buy New Policy
          </a>
        }
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-input">
          <span class="material-icons-outlined">search</span>
          <input type="text" placeholder="Search by policy number, plan name..." [(ngModel)]="searchTerm" (input)="applyFilters()">
        </div>
        <select class="filter-select" [(ngModel)]="filterType" (change)="applyFilters()">
          <option value="">All Types</option>
          <option value="LIFE">Life Insurance</option>
          <option value="HEALTH">Health Insurance</option>
          <option value="TERM">Term Insurance</option>
          <option value="VEHICLE">Vehicle Insurance</option>
        </select>
        <select class="filter-select" [(ngModel)]="filterStatus" (change)="applyFilters()">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <!-- Policy Cards -->
      <div class="policy-card-grid stagger">
        @for (policy of filteredPolicies(); track policy.id) {
          <div class="policy-card animate-fade-in" [class]="policy.type">
            <div class="policy-card-header">
              <div>
                <h4>{{ policy.planName }}</h4>
                <div class="policy-number">{{ policy.policyNumber }}</div>
              </div>
              <span class="badge-status" [class]="'badge-' + policy.status.toLowerCase()">{{ policy.status }}</span>
            </div>
            <div class="policy-card-body">
              <div class="policy-field">
                <span class="label">Cover Amount</span>
                <span class="value">{{ policy.coverAmount | inr }}</span>
              </div>
              <div class="policy-field">
                <span class="label">Premium</span>
                <span class="value">{{ policy.premiumAmount | inr }} / {{ formatFreq(policy.paymentFrequency) }}</span>
              </div>
              <div class="policy-field">
                <span class="label">Start Date</span>
                <span class="value">{{ policy.startDate }}</span>
              </div>
              <div class="policy-field">
                <span class="label">End Date</span>
                <span class="value">{{ policy.endDate }}</span>
              </div>
              @if (policy.customerName && (isAdmin || isAgent)) {
                <div class="policy-field" style="grid-column:1/-1">
                  <span class="label">Customer</span>
                  <span class="value">{{ policy.customerName }}</span>
                </div>
              }
              @if (policy.vehicleDetails) {
                <div class="policy-field" style="grid-column:1/-1">
                  <span class="label">Vehicle</span>
                  <span class="value">{{ policy.vehicleDetails.make }} {{ policy.vehicleDetails.model }} ({{ policy.vehicleDetails.registrationNumber }})</span>
                </div>
              }
            </div>
            <div class="policy-card-footer">
              <span class="badge-policy-type" [class]="'badge-' + policy.type">{{ policy.type }}</span>
              <div style="display:flex;gap:8px">
                <button class="btn btn-sm btn-outline" (click)="viewPolicy(policy)">
                  <span class="material-icons-outlined" style="font-size:14px">visibility</span>
                  Details
                </button>
                @if (!isAdmin) {
                  <button class="btn btn-sm btn-outline" style="color:var(--success)">
                    <span class="material-icons-outlined" style="font-size:14px">download</span>
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      @if (filteredPolicies().length === 0) {
        <div class="empty-state">
          <div class="icon">📋</div>
          <h3>No Policies Found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      }

      <!-- Policy Detail Modal -->
      @if (selectedPolicy()) {
        <div class="modal-overlay" (click)="selectedPolicy.set(null)">
          <div class="modal" (click)="$event.stopPropagation()" style="max-width:700px">
            <div class="modal-header">
              <h2>Policy Details</h2>
              <button class="btn-icon btn-outline" (click)="selectedPolicy.set(null)">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              @if (selectedPolicy(); as p) {
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
                  <div>
                    <h3 style="font-size:20px;margin-bottom:4px">{{ p.planName }}</h3>
                    <div style="font-size:13px;color:var(--text-muted);font-family:monospace">{{ p.policyNumber }}</div>
                  </div>
                  <span class="badge-status" [class]="'badge-' + p.status.toLowerCase()">{{ p.status }}</span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
                  <div class="policy-field"><span class="label">Policy Type</span><span class="value"><span class="badge-policy-type" [class]="'badge-' + p.type">{{ p.type }}</span></span></div>
                  <div class="policy-field"><span class="label">Cover Amount</span><span class="value">{{ p.coverAmount | inr }}</span></div>
                  <div class="policy-field"><span class="label">Premium</span><span class="value">{{ p.premiumAmount | inr }} / {{ formatFreq(p.paymentFrequency) }}</span></div>
                  <div class="policy-field"><span class="label">Tenure</span><span class="value">{{ p.tenure }} {{ p.tenure === 1 ? 'Year' : 'Years' }}</span></div>
                  <div class="policy-field"><span class="label">Start Date</span><span class="value">{{ p.startDate }}</span></div>
                  <div class="policy-field"><span class="label">End Date</span><span class="value">{{ p.endDate }}</span></div>
                  @if (p.agentName) {
                    <div class="policy-field"><span class="label">Agent</span><span class="value">{{ p.agentName }}</span></div>
                  }
                  <div class="policy-field"><span class="label">Customer</span><span class="value">{{ p.customerName }}</span></div>
                </div>

                @if (p.nominees.length) {
                  <h4 style="font-size:14px;margin-bottom:12px;color:var(--text-secondary)">👥 Nominees</h4>
                  <div style="margin-bottom:20px">
                    @for (n of p.nominees; track n.name) {
                      <div style="display:flex;justify-content:space-between;padding:10px 16px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:6px">
                        <span style="font-weight:600">{{ n.name }}</span>
                        <span style="color:var(--text-muted)">{{ n.relationship }} • {{ n.percentage }}%</span>
                      </div>
                    }
                  </div>
                }

                @if (p.vehicleDetails; as v) {
                  <h4 style="font-size:14px;margin-bottom:12px;color:var(--text-secondary)">🚗 Vehicle Details</h4>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;background:var(--bg);border-radius:var(--radius-md)">
                    <div class="policy-field"><span class="label">Vehicle</span><span class="value">{{ v.make }} {{ v.model }} ({{ v.year }})</span></div>
                    <div class="policy-field"><span class="label">Reg. No</span><span class="value">{{ v.registrationNumber }}</span></div>
                    <div class="policy-field"><span class="label">Fuel</span><span class="value">{{ v.fuelType }}</span></div>
                    <div class="policy-field"><span class="label">RTO</span><span class="value">{{ v.rtoCity }}</span></div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PolicyListComponent implements OnInit {
  allPolicies: Policy[] = [];
  filteredPolicies = signal<Policy[]>([]);
  selectedPolicy = signal<Policy | null>(null);
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  isAdmin = false;
  isAgent = false;

  constructor(private authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    const role = this.authService.userRole();
    this.isAdmin = role === 'ADMIN';
    this.isAgent = role === 'AGENT';
    const userId = this.authService.user()?.id || '';
    if (this.isAdmin) {
      this.allPolicies = this.mockData.getPolicies();
    } else if (this.isAgent) {
      this.allPolicies = this.mockData.getPoliciesByAgent(userId);
    } else {
      this.allPolicies = this.mockData.getPoliciesByCustomer(userId);
    }
    this.filteredPolicies.set(this.allPolicies);
  }

  applyFilters() {
    let result = [...this.allPolicies];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => p.policyNumber.toLowerCase().includes(term) || p.planName.toLowerCase().includes(term) || p.customerName.toLowerCase().includes(term));
    }
    if (this.filterType) result = result.filter(p => p.type === this.filterType);
    if (this.filterStatus) result = result.filter(p => p.status === this.filterStatus);
    this.filteredPolicies.set(result);
  }

  formatFreq(freq: string): string {
    return freq.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  viewPolicy(policy: Policy) {
    this.selectedPolicy.set(policy);
  }
}
