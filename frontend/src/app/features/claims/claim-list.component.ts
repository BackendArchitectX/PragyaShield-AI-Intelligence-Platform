import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Claim } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div>
          <h2>My Claims</h2>
          <p class="subtitle">Track and manage your insurance claims</p>
        </div>
        <a routerLink="/customer/file-claim" class="btn btn-accent">
          <span class="material-icons-outlined" style="font-size:18px">note_add</span>
          File New Claim
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-input">
          <span class="material-icons-outlined">search</span>
          <input type="text" placeholder="Search by claim number..." [(ngModel)]="searchTerm" (input)="filter()">
        </div>
        <select class="filter-select" [(ngModel)]="statusFilter" (change)="filter()">
          <option value="">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SETTLED">Settled</option>
        </select>
      </div>

      <!-- Claims List -->
      @for (claim of filteredClaims(); track claim.id) {
        <div class="card" style="margin-bottom:16px;cursor:pointer" (click)="selectedClaim.set(claim)">
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
              <div style="display:flex;align-items:flex-start;gap:16px">
                <div style="width:48px;height:48px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:22px"
                     [style.background]="getTypeColor(claim.type).bg" [style.color]="getTypeColor(claim.type).text">
                  {{ getTypeIcon(claim.type) }}
                </div>
                <div>
                  <h4 style="font-size:15px;margin-bottom:4px">{{ claim.reason }}</h4>
                  <div style="font-size:12px;color:var(--text-muted);font-family:monospace">{{ claim.claimNumber }}</div>
                  <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Policy: {{ claim.policyNumber }} • Filed: {{ claim.filingDate }}</div>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:18px;font-weight:700;margin-bottom:4px">{{ claim.claimAmount | inr }}</div>
                @if (claim.approvedAmount) {
                  <div style="font-size:12px;color:var(--success)">Approved: {{ claim.approvedAmount | inr }}</div>
                }
                <span class="badge-status" [class]="'badge-' + claim.status.toLowerCase()" style="margin-top:4px">{{ claim.status.replace('_', ' ') }}</span>
              </div>
            </div>
          </div>
        </div>
      }

      @if (filteredClaims().length === 0) {
        <div class="empty-state">
          <div class="icon">📋</div>
          <h3>No Claims Found</h3>
          <p>You haven't filed any claims yet</p>
        </div>
      }

      <!-- Claim Detail Modal -->
      @if (selectedClaim(); as claim) {
        <div class="modal-overlay" (click)="selectedClaim.set(null)">
          <div class="modal" (click)="$event.stopPropagation()" style="max-width:650px">
            <div class="modal-header">
              <h2>Claim Details</h2>
              <button class="btn-icon btn-outline" (click)="selectedClaim.set(null)">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
                <div>
                  <h3 style="margin-bottom:4px">{{ claim.reason }}</h3>
                  <span style="font-size:12px;color:var(--text-muted);font-family:monospace">{{ claim.claimNumber }}</span>
                </div>
                <span class="badge-status" [class]="'badge-' + claim.status.toLowerCase()">{{ claim.status.replace('_', ' ') }}</span>
              </div>

              <div class="grid-2" style="margin-bottom:24px">
                <div class="policy-field"><span class="label">Claim Amount</span><span class="value">{{ claim.claimAmount | inr }}</span></div>
                @if (claim.approvedAmount) {
                  <div class="policy-field"><span class="label">Approved Amount</span><span class="value" style="color:var(--success)">{{ claim.approvedAmount | inr }}</span></div>
                }
                <div class="policy-field"><span class="label">Incident Date</span><span class="value">{{ claim.incidentDate }}</span></div>
                <div class="policy-field"><span class="label">Filing Date</span><span class="value">{{ claim.filingDate }}</span></div>
              </div>

              <div style="margin-bottom:24px">
                <h4 style="font-size:14px;margin-bottom:8px">Description</h4>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:var(--bg);padding:16px;border-radius:var(--radius-md)">{{ claim.description }}</p>
              </div>

              @if (claim.reviewNotes) {
                <div class="alert" [class]="claim.status === 'APPROVED' || claim.status === 'SETTLED' ? 'alert-success' : 'alert-error'" style="margin-bottom:24px">
                  <span class="material-icons-outlined" style="font-size:18px">{{ claim.status === 'APPROVED' || claim.status === 'SETTLED' ? 'check_circle' : 'cancel' }}</span>
                  <div>
                    <div style="font-weight:600;margin-bottom:4px">Reviewer Notes</div>
                    <div style="font-size:13px">{{ claim.reviewNotes }}</div>
                  </div>
                </div>
              }

              <!-- Timeline -->
              <h4 style="font-size:14px;margin-bottom:16px">📋 Claim Timeline</h4>
              <div class="timeline">
                @for (item of claim.timeline; track item.date; let last = $last) {
                  <div class="timeline-item" [class.active]="last">
                    <div class="timeline-date">{{ item.date }}</div>
                    <div class="timeline-title">{{ item.status.replace('_', ' ') }}</div>
                    <div class="timeline-desc">{{ item.note }}</div>
                  </div>
                }
              </div>

              <!-- Documents -->
              @if (claim.documents.length > 0) {
                <h4 style="font-size:14px;margin:20px 0 12px">📎 Attached Documents</h4>
                @for (doc of claim.documents; track doc.id) {
                  <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:6px">
                    <span class="material-icons-outlined" style="font-size:20px;color:var(--primary)">description</span>
                    <span style="flex:1;font-size:13px;font-weight:500">{{ doc.name }}</span>
                    <span style="font-size:11px;color:var(--text-muted)">{{ doc.type }}</span>
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
export class ClaimListComponent implements OnInit {
  allClaims: Claim[] = [];
  filteredClaims = signal<Claim[]>([]);
  selectedClaim = signal<Claim | null>(null);
  searchTerm = '';
  statusFilter = '';

  constructor(private authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    const userId = this.authService.user()?.id || '';
    this.allClaims = this.mockData.getClaimsByCustomer(userId);
    this.filteredClaims.set(this.allClaims);
  }

  filter() {
    let result = [...this.allClaims];
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      result = result.filter(c => c.claimNumber.toLowerCase().includes(t) || c.reason.toLowerCase().includes(t));
    }
    if (this.statusFilter) result = result.filter(c => c.status === this.statusFilter);
    this.filteredClaims.set(result);
  }

  getTypeIcon(type: string): string {
    return { LIFE: '🛡️', HEALTH: '🏥', TERM: '⚡', VEHICLE: '🚗' }[type] || '📋';
  }

  getTypeColor(type: string): { bg: string; text: string } {
    const map: Record<string, { bg: string; text: string }> = {
      LIFE: { bg: '#EDE7F6', text: '#5E35B1' }, HEALTH: { bg: '#E8F5E9', text: '#2E7D32' },
      TERM: { bg: '#E3F2FD', text: '#1565C0' }, VEHICLE: { bg: '#FFF3E0', text: '#E65100' }
    };
    return map[type] || { bg: '#F5F5F5', text: '#666' };
  }
}
