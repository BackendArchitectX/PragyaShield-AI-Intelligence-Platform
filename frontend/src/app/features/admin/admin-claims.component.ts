import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Claim, ClaimStatus } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div><h2>Claims Review & Management</h2><p class="subtitle">Review, approve, or reject insurance claims</p></div>
      </div>

      <!-- Status Summary -->
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        <button class="btn" [class]="statusFilter === '' ? 'btn-primary' : 'btn-outline'" style="width:auto" (click)="setStatusFilter('')">
          All ({{ allClaims.length }})
        </button>
        <button class="btn" [class]="statusFilter === 'SUBMITTED' ? 'btn-warning' : 'btn-outline'" style="width:auto" (click)="setStatusFilter('SUBMITTED')">
          🔔 Submitted ({{ getCountByStatus('SUBMITTED') }})
        </button>
        <button class="btn" [class]="statusFilter === 'UNDER_REVIEW' ? 'btn-accent' : 'btn-outline'" style="width:auto" (click)="setStatusFilter('UNDER_REVIEW')">
          🔍 Under Review ({{ getCountByStatus('UNDER_REVIEW') }})
        </button>
        <button class="btn" [class]="statusFilter === 'APPROVED' ? 'btn-success' : 'btn-outline'" style="width:auto" (click)="setStatusFilter('APPROVED')">
          ✅ Approved ({{ getCountByStatus('APPROVED') }})
        </button>
        <button class="btn" [class]="statusFilter === 'REJECTED' ? 'btn-error' : 'btn-outline'" style="width:auto" (click)="setStatusFilter('REJECTED')">
          ❌ Rejected ({{ getCountByStatus('REJECTED') }})
        </button>
      </div>

      <!-- Claims Table -->
      <div class="card">
        <div class="card-body" style="padding:0;overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Claim No.</th><th>Customer</th><th>Type</th><th>Policy</th>
                <th>Reason</th><th>Amount</th><th>Filed</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (claim of filteredClaims(); track claim.id) {
                <tr>
                  <td style="font-family:monospace;font-size:11px">{{ claim.claimNumber }}</td>
                  <td style="font-weight:600">{{ claim.customerName }}</td>
                  <td><span class="badge-policy-type" [class]="'badge-' + claim.type">{{ claim.type }}</span></td>
                  <td style="font-size:12px">{{ claim.policyNumber }}</td>
                  <td style="max-width:200px">
                    <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" [title]="claim.reason">{{ claim.reason }}</div>
                  </td>
                  <td style="font-weight:700">{{ claim.claimAmount | inr }}</td>
                  <td>{{ claim.filingDate }}</td>
                  <td><span class="badge-status" [class]="'badge-' + claim.status.toLowerCase()">{{ claim.status.replace('_', ' ') }}</span></td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-sm btn-outline" (click)="openReview(claim)" title="Review">
                        <span class="material-icons-outlined" style="font-size:14px">visibility</span>
                      </button>
                      @if (claim.status === 'SUBMITTED' || claim.status === 'UNDER_REVIEW') {
                        <button class="btn btn-sm btn-success" (click)="openAction(claim, 'APPROVE')" title="Approve" style="padding:6px 10px">
                          <span class="material-icons-outlined" style="font-size:14px">check</span>
                        </button>
                        <button class="btn btn-sm btn-error" (click)="openAction(claim, 'REJECT')" title="Reject" style="padding:6px 10px">
                          <span class="material-icons-outlined" style="font-size:14px">close</span>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredClaims().length === 0) {
            <div class="empty-state"><div class="icon">📋</div><h3>No Claims Found</h3></div>
          }
        </div>
      </div>

      <!-- Review Modal -->
      @if (reviewClaim(); as claim) {
        <div class="modal-overlay" (click)="reviewClaim.set(null)">
          <div class="modal" (click)="$event.stopPropagation()" style="max-width:700px">
            <div class="modal-header">
              <h2>Claim Review</h2>
              <button class="btn-icon btn-outline" (click)="reviewClaim.set(null)">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div style="display:flex;justify-content:space-between;margin-bottom:20px">
                <div>
                  <h3 style="margin-bottom:4px">{{ claim.reason }}</h3>
                  <span style="font-size:12px;color:var(--text-muted);font-family:monospace">{{ claim.claimNumber }}</span>
                </div>
                <span class="badge-status" [class]="'badge-' + claim.status.toLowerCase()">{{ claim.status.replace('_', ' ') }}</span>
              </div>

              <div class="grid-2" style="margin-bottom:20px">
                <div class="policy-field"><span class="label">Customer</span><span class="value">{{ claim.customerName }}</span></div>
                <div class="policy-field"><span class="label">Policy</span><span class="value" style="font-size:12px;font-family:monospace">{{ claim.policyNumber }}</span></div>
                <div class="policy-field"><span class="label">Claim Amount</span><span class="value">{{ claim.claimAmount | inr }}</span></div>
                <div class="policy-field"><span class="label">Incident Date</span><span class="value">{{ claim.incidentDate }}</span></div>
              </div>

              <div style="margin-bottom:20px">
                <h4 style="font-size:13px;margin-bottom:6px;color:var(--text-secondary)">Description</h4>
                <p style="font-size:13px;line-height:1.6;padding:14px;background:var(--bg);border-radius:var(--radius-sm)">{{ claim.description }}</p>
              </div>

              @if (claim.documents.length > 0) {
                <h4 style="font-size:13px;margin-bottom:8px;color:var(--text-secondary)">📎 Documents ({{ claim.documents.length }})</h4>
                @for (doc of claim.documents; track doc.id) {
                  <div style="display:flex;align-items:center;gap:10px;padding:8px 14px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:4px">
                    <span class="material-icons-outlined" style="font-size:18px;color:var(--primary)">description</span>
                    <span style="flex:1;font-size:13px">{{ doc.name }}</span>
                    <button class="btn btn-sm btn-outline" style="padding:4px 8px"><span class="material-icons-outlined" style="font-size:14px">download</span></button>
                  </div>
                }
              }

              <h4 style="font-size:13px;margin:20px 0 10px;color:var(--text-secondary)">📋 Timeline</h4>
              <div class="timeline">
                @for (item of claim.timeline; track item.date; let last = $last) {
                  <div class="timeline-item" [class.active]="last">
                    <div class="timeline-date">{{ item.date }}</div>
                    <div class="timeline-title">{{ item.status.replace('_', ' ') }}</div>
                    <div class="timeline-desc">{{ item.note }}</div>
                  </div>
                }
              </div>

              @if (claim.reviewNotes) {
                <div class="alert" [class]="claim.status === 'APPROVED' ? 'alert-success' : 'alert-error'" style="margin-top:16px">
                  <div><div style="font-weight:600;font-size:13px">Review Notes</div><div style="font-size:12px">{{ claim.reviewNotes }}</div></div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Approve/Reject Modal -->
      @if (actionClaim()) {
        <div class="modal-overlay" (click)="closeAction()">
          <div class="modal" (click)="$event.stopPropagation()" style="max-width:500px">
            <div class="modal-header">
              <h2 [style.color]="actionType() === 'APPROVE' ? 'var(--success)' : 'var(--error)'">
                {{ actionType() === 'APPROVE' ? '✅ Approve' : '❌ Reject' }} Claim
              </h2>
              <button class="btn-icon btn-outline" (click)="closeAction()">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div style="background:var(--bg);padding:16px;border-radius:var(--radius-md);margin-bottom:20px">
                <div style="font-weight:600;margin-bottom:4px">{{ actionClaim()!.claimNumber }}</div>
                <div style="font-size:13px;color:var(--text-secondary)">{{ actionClaim()!.reason }}</div>
                <div style="font-size:15px;font-weight:700;margin-top:8px">Claim Amount: {{ actionClaim()!.claimAmount | inr }}</div>
              </div>

              @if (actionType() === 'APPROVE') {
                <div class="form-group">
                  <label>Approved Amount (₹) *</label>
                  <input type="number" class="form-control" [(ngModel)]="approvedAmount" [max]="actionClaim()!.claimAmount">
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Max: {{ actionClaim()!.claimAmount | inr }}</div>
                </div>
              }

              <div class="form-group">
                <label>Review Notes *</label>
                <textarea class="form-control" [(ngModel)]="reviewNotes" rows="3"
                          [placeholder]="actionType() === 'APPROVE' ? 'e.g. All documents verified. Approved after deduction...' : 'e.g. Reason for rejection...'"></textarea>
              </div>

              @if (actionError()) {
                <div class="alert alert-error" style="margin-bottom:16px">{{ actionError() }}</div>
              }

              @if (actionSuccess()) {
                <div class="alert alert-success" style="margin-bottom:16px">{{ actionSuccess() }}</div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeAction()">Cancel</button>
              @if (actionType() === 'APPROVE') {
                <button class="btn btn-success" (click)="processAction()" [disabled]="isProcessing()">
                  {{ isProcessing() ? 'Processing...' : '✅ Approve Claim' }}
                </button>
              } @else {
                <button class="btn btn-error" (click)="processAction()" [disabled]="isProcessing()">
                  {{ isProcessing() ? 'Processing...' : '❌ Reject Claim' }}
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminClaimsComponent implements OnInit {
  allClaims: Claim[] = [];
  filteredClaims = signal<Claim[]>([]);
  statusFilter = '';
  reviewClaim = signal<Claim | null>(null);
  actionClaim = signal<Claim | null>(null);
  actionType = signal<'APPROVE' | 'REJECT'>('APPROVE');
  approvedAmount = 0;
  reviewNotes = '';
  actionError = signal('');
  actionSuccess = signal('');
  isProcessing = signal(false);

  constructor(private authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.allClaims = this.mockData.getClaims();
    this.applyFilter();
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredClaims.set(this.statusFilter ? this.allClaims.filter(c => c.status === this.statusFilter) : [...this.allClaims]);
  }

  getCountByStatus(status: string): number {
    return this.allClaims.filter(c => c.status === status).length;
  }

  openReview(claim: Claim) { this.reviewClaim.set(claim); }

  openAction(claim: Claim, type: 'APPROVE' | 'REJECT') {
    this.actionClaim.set(claim);
    this.actionType.set(type);
    this.approvedAmount = claim.claimAmount;
    this.reviewNotes = '';
    this.actionError.set('');
    this.actionSuccess.set('');
  }

  closeAction() {
    this.actionClaim.set(null);
    this.actionError.set('');
    this.actionSuccess.set('');
  }

  processAction() {
    if (!this.reviewNotes.trim()) {
      this.actionError.set('Please provide review notes.');
      return;
    }
    if (this.actionType() === 'APPROVE' && this.approvedAmount <= 0) {
      this.actionError.set('Please enter a valid approved amount.');
      return;
    }

    this.isProcessing.set(true);
    this.actionError.set('');

    setTimeout(() => {
      const claim = this.actionClaim()!;
      const newStatus: ClaimStatus = this.actionType() === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const adminId = this.authService.user()?.id || 'ADM001';

      this.mockData.updateClaimStatus(
        claim.id, newStatus, this.reviewNotes, adminId,
        this.actionType() === 'APPROVE' ? this.approvedAmount : undefined
      );

      this.isProcessing.set(false);
      this.actionSuccess.set(`Claim ${newStatus.toLowerCase()} successfully!`);

      setTimeout(() => {
        this.closeAction();
        this.loadClaims();
      }, 1200);
    }, 1500);
  }
}
