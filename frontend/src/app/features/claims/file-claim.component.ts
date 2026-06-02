import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Policy, Claim } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-file-claim',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe],
  template: `
    <div class="animate-fade-in" style="max-width:700px;margin:0 auto">
      @if (!submitted()) {
        <div class="card">
          <div class="card-header">
            <h3>📝 File a New Claim</h3>
          </div>
          <div class="card-body">
            @if (errorMsg()) {
              <div class="alert alert-error">{{ errorMsg() }}</div>
            }

            <div class="form-group">
              <label>Select Policy *</label>
              <select class="form-control" [(ngModel)]="selectedPolicyId">
                <option value="">-- Select a Policy --</option>
                @for (p of activePolicies; track p.id) {
                  <option [value]="p.id">{{ p.policyNumber }} - {{ p.planName }} ({{ p.type }})</option>
                }
              </select>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Claim Amount (₹) *</label>
                <input type="number" class="form-control" [(ngModel)]="claimAmount" placeholder="e.g. 50000">
              </div>
              <div class="form-group">
                <label>Incident Date *</label>
                <input type="date" class="form-control" [(ngModel)]="incidentDate">
              </div>
            </div>

            <div class="form-group">
              <label>Reason for Claim *</label>
              <input class="form-control" [(ngModel)]="reason" placeholder="e.g. Hospitalization, Vehicle Accident, etc.">
            </div>

            <div class="form-group">
              <label>Detailed Description *</label>
              <textarea class="form-control" [(ngModel)]="description" rows="4"
                        placeholder="Provide details about the incident, treatment, damages, etc."></textarea>
            </div>

            <div class="form-group">
              <label>Supporting Documents</label>
              <div style="border:2px dashed var(--border);border-radius:var(--radius-md);padding:32px;text-align:center;background:var(--bg)">
                <span class="material-icons-outlined" style="font-size:40px;color:var(--text-muted);margin-bottom:8px">cloud_upload</span>
                <p style="color:var(--text-secondary);font-size:13px">Drag & drop files here or click to browse</p>
                <p style="color:var(--text-muted);font-size:11px;margin-top:4px">Hospital bills, FIR copy, photos, discharge summary (PDF, JPG, PNG)</p>
                <button class="btn btn-sm btn-outline" style="margin-top:12px">
                  <span class="material-icons-outlined" style="font-size:14px">attach_file</span> Choose Files
                </button>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;margin-top:24px">
              <button class="btn btn-outline" routerLink="/customer/claims">Cancel</button>
              <button class="btn btn-accent" (click)="submitClaim()" [disabled]="isSubmitting()">
                @if (isSubmitting()) {
                  Submitting...
                } @else {
                  <span class="material-icons-outlined" style="font-size:16px">send</span> Submit Claim
                }
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Success -->
        <div style="text-align:center;padding:40px 0" class="animate-fade-in">
          <div style="font-size:72px;margin-bottom:16px">✅</div>
          <h2 style="color:var(--success);margin-bottom:8px">Claim Submitted Successfully!</h2>
          <p style="color:var(--text-secondary);margin-bottom:8px">Claim Number: <strong style="font-family:monospace">{{ newClaimNumber }}</strong></p>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:32px">Our team will review your claim within 48-72 hours. You'll receive updates via email and SMS.</p>
          <div style="display:flex;gap:12px;justify-content:center">
            <a routerLink="/customer/claims" class="btn btn-primary" style="width:auto">View My Claims</a>
            <a routerLink="/customer/dashboard" class="btn btn-outline">Go to Dashboard</a>
          </div>
        </div>
      }
    </div>
  `
})
export class FileClaimComponent implements OnInit {
  activePolicies: Policy[] = [];
  selectedPolicyId = '';
  claimAmount = 0;
  incidentDate = '';
  reason = '';
  description = '';
  errorMsg = signal('');
  isSubmitting = signal(false);
  submitted = signal(false);
  newClaimNumber = '';

  constructor(private authService: AuthService, private mockData: MockDataService, private router: Router) {}

  ngOnInit() {
    const userId = this.authService.user()?.id || '';
    this.activePolicies = this.mockData.getPoliciesByCustomer(userId).filter(p => p.status === 'ACTIVE');
  }

  submitClaim() {
    this.errorMsg.set('');
    if (!this.selectedPolicyId || !this.claimAmount || !this.incidentDate || !this.reason || !this.description) {
      this.errorMsg.set('Please fill in all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      const user = this.authService.user()!;
      const policy = this.mockData.getPolicyById(this.selectedPolicyId)!;
      const now = new Date().toISOString().split('T')[0];
      this.newClaimNumber = `AON-CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

      const claim: Claim = {
        id: 'CLM' + Date.now(), claimNumber: this.newClaimNumber,
        policyId: policy.id, policyNumber: policy.policyNumber,
        customerId: user.id, customerName: user.fullName,
        type: policy.type, status: 'SUBMITTED',
        claimAmount: this.claimAmount, reason: this.reason,
        description: this.description, incidentDate: this.incidentDate,
        filingDate: now, documents: [],
        timeline: [{ status: 'SUBMITTED', date: now, note: 'Claim submitted with supporting documents', updatedBy: user.id }],
        createdAt: now, updatedAt: now
      };
      this.mockData.addClaim(claim);
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 1500);
  }
}
