import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { InsurancePlan, PolicyType, Policy, Transaction } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-buy-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      @if (!selectedPlan()) {
        <!-- Plan Selection -->
        <div class="page-title-section">
          <div>
            <h2>Choose Your Insurance Plan</h2>
            <p class="subtitle">Protect what matters most with our comprehensive plans</p>
          </div>
        </div>

        <!-- Type Tabs -->
        <div class="tabs">
          <button class="tab" [class.active]="activeTab() === 'ALL'" (click)="setTab('ALL')">All Plans</button>
          <button class="tab" [class.active]="activeTab() === 'LIFE'" (click)="setTab('LIFE')">🛡️ Life</button>
          <button class="tab" [class.active]="activeTab() === 'HEALTH'" (click)="setTab('HEALTH')">🏥 Health</button>
          <button class="tab" [class.active]="activeTab() === 'TERM'" (click)="setTab('TERM')">⚡ Term</button>
          <button class="tab" [class.active]="activeTab() === 'VEHICLE'" (click)="setTab('VEHICLE')">🚗 Vehicle</button>
        </div>

        <div class="plan-grid stagger">
          @for (plan of filteredPlans(); track plan.id) {
            <div class="plan-card animate-fade-in">
              @if (plan.popularTag) {
                <div class="popular-tag">Popular</div>
              }
              <div class="plan-icon">{{ plan.icon }}</div>
              <span class="badge-policy-type" [class]="'badge-' + plan.type" style="margin-bottom:12px">{{ plan.type }}</span>
              <h3>{{ plan.name }}</h3>
              <p class="plan-desc">{{ plan.description }}</p>
              <ul class="plan-features">
                @for (f of plan.features.slice(0, 4); track f) {
                  <li>{{ f }}</li>
                }
              </ul>
              <div class="plan-price">
                <span class="from">From</span>
                <span class="amount">{{ plan.minPremium | inr }}</span>
                <span class="period">/ year</span>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-accent" style="flex:1" (click)="selectPlan(plan)">
                  Buy Now
                </button>
                <button class="btn btn-outline" (click)="selectPlan(plan)">
                  <span class="material-icons-outlined" style="font-size:16px">info</span>
                </button>
              </div>
            </div>
          }
        </div>
      } @else if (!purchaseComplete()) {
        <!-- Purchase Form -->
        <div style="max-width:800px;margin:0 auto">
          <button class="btn btn-outline btn-sm" style="margin-bottom:20px" (click)="selectedPlan.set(null)">
            <span class="material-icons-outlined" style="font-size:16px">arrow_back</span> Back to Plans
          </button>

          <div class="card">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:12px">
                <span style="font-size:32px">{{ selectedPlan()!.icon }}</span>
                <div>
                  <h3>{{ selectedPlan()!.name }}</h3>
                  <span class="badge-policy-type" [class]="'badge-' + selectedPlan()!.type">{{ selectedPlan()!.type }}</span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Step Indicator -->
              <div style="display:flex;gap:8px;margin-bottom:32px">
                @for (s of ['Plan Details', 'Personal Info', 'Payment']; track s; let i = $index) {
                  <div style="flex:1;text-align:center">
                    <div style="width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;margin-bottom:6px"
                         [style.background]="step() >= i + 1 ? 'var(--primary)' : 'var(--bg)'"
                         [style.color]="step() >= i + 1 ? 'white' : 'var(--text-muted)'">{{ i + 1 }}</div>
                    <div style="font-size:12px;font-weight:600" [style.color]="step() >= i + 1 ? 'var(--primary)' : 'var(--text-muted)'">{{ s }}</div>
                  </div>
                }
              </div>

              <!-- Step 1: Plan Configuration -->
              @if (step() === 1) {
                <div class="grid-2">
                  <div class="form-group">
                    <label>Cover Amount (₹)</label>
                    <select class="form-control" [(ngModel)]="coverAmount">
                      @for (amt of getCoverOptions(); track amt) {
                        <option [value]="amt">{{ amt | inr }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Policy Tenure</label>
                    <select class="form-control" [(ngModel)]="tenure">
                      @for (t of selectedPlan()!.tenure; track t) {
                        <option [value]="t">{{ t }} {{ t === 1 ? 'Year' : 'Years' }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Payment Frequency</label>
                    <select class="form-control" [(ngModel)]="frequency">
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="HALF_YEARLY">Half Yearly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Estimated Premium</label>
                    <div class="form-control" style="background:var(--primary-50);border-color:var(--primary-200);font-weight:700;color:var(--primary);font-size:18px">
                      {{ calculatePremium() | inr }}
                      <span style="font-size:12px;font-weight:400;color:var(--text-secondary)"> / {{ frequency.replace('_',' ').toLowerCase() }}</span>
                    </div>
                  </div>
                </div>

                @if (selectedPlan()!.type === 'VEHICLE') {
                  <h4 style="margin:20px 0 12px;font-size:14px">🚗 Vehicle Details</h4>
                  <div class="grid-2">
                    <div class="form-group"><label>Vehicle Type</label>
                      <select class="form-control" [(ngModel)]="vehicleType">
                        <option value="TWO_WHEELER">Two Wheeler</option>
                        <option value="FOUR_WHEELER">Four Wheeler</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>
                    <div class="form-group"><label>Make</label><input class="form-control" [(ngModel)]="vehicleMake" placeholder="e.g. Maruti Suzuki"></div>
                    <div class="form-group"><label>Model</label><input class="form-control" [(ngModel)]="vehicleModel" placeholder="e.g. Swift Dzire"></div>
                    <div class="form-group"><label>Registration Number</label><input class="form-control" [(ngModel)]="vehicleRegNo" placeholder="MH-12-AB-1234"></div>
                  </div>
                }
              }

              <!-- Step 2: Nominee -->
              @if (step() === 2) {
                <h4 style="margin-bottom:16px;font-size:14px">👤 Nominee Details</h4>
                <div class="grid-2">
                  <div class="form-group"><label>Nominee Name</label><input class="form-control" [(ngModel)]="nomineeName" placeholder="Full name"></div>
                  <div class="form-group"><label>Relationship</label>
                    <select class="form-control" [(ngModel)]="nomineeRelation">
                      <option value="">Select</option>
                      <option>Spouse</option><option>Son</option><option>Daughter</option>
                      <option>Father</option><option>Mother</option><option>Other</option>
                    </select>
                  </div>
                  <div class="form-group"><label>Date of Birth</label><input type="date" class="form-control" [(ngModel)]="nomineeDob"></div>
                  <div class="form-group"><label>Aadhaar Last 4 Digits</label><input class="form-control" [(ngModel)]="nomineeAadhaar" maxlength="4" placeholder="1234"></div>
                </div>
              }

              <!-- Step 3: Payment -->
              @if (step() === 3) {
                <div style="text-align:center;margin-bottom:24px">
                  <h3 style="font-size:18px;margin-bottom:4px">Payment Summary</h3>
                  <p style="color:var(--text-muted)">Review and complete your purchase</p>
                </div>
                <div style="background:var(--bg);border-radius:var(--radius-md);padding:24px;margin-bottom:24px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                    <span>Plan</span><span style="font-weight:700">{{ selectedPlan()!.name }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                    <span>Cover</span><span style="font-weight:700">{{ coverAmount | inr }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                    <span>Premium</span><span style="font-weight:700">{{ calculatePremium() | inr }}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:12px">
                    <span>GST (18%)</span><span style="font-weight:700">{{ calculateGST() | inr }}</span>
                  </div>
                  <div style="border-top:2px solid var(--border);padding-top:12px;display:flex;justify-content:space-between">
                    <span style="font-weight:700;font-size:16px">Total Payable</span>
                    <span style="font-weight:800;font-size:20px;color:var(--primary)">{{ calculateTotal() | inr }}</span>
                  </div>
                </div>
                <div class="form-group">
                  <label>Payment Method</label>
                  <select class="form-control" [(ngModel)]="paymentMethod">
                    <option value="UPI">UPI (Google Pay / PhonePe / BHIM)</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="AUTO_DEBIT">Auto Debit (NACH Mandate)</option>
                  </select>
                </div>
              }

              <!-- Navigation -->
              <div style="display:flex;justify-content:space-between;margin-top:32px">
                <button class="btn btn-outline" (click)="prevStep()" [style.visibility]="step() === 1 ? 'hidden' : 'visible'">
                  <span class="material-icons-outlined" style="font-size:16px">arrow_back</span> Previous
                </button>
                @if (step() < 3) {
                  <button class="btn btn-primary" style="width:auto" (click)="nextStep()">
                    Next <span class="material-icons-outlined" style="font-size:16px">arrow_forward</span>
                  </button>
                } @else {
                  <button class="btn btn-accent btn-lg" (click)="completePurchase()" [disabled]="isProcessing()">
                    @if (isProcessing()) {
                      Processing Payment...
                    } @else {
                      <span class="material-icons-outlined" style="font-size:18px">lock</span>
                      Pay {{ calculateTotal() | inr }}
                    }
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Purchase Complete -->
        <div style="max-width:600px;margin:40px auto;text-align:center" class="animate-fade-in">
          <div style="font-size:80px;margin-bottom:16px">🎉</div>
          <h2 style="font-size:28px;color:var(--success);margin-bottom:8px">Policy Purchased Successfully!</h2>
          <p style="color:var(--text-secondary);margin-bottom:32px">Your policy has been activated. Details have been sent to your registered email.</p>
          <div class="card" style="text-align:left">
            <div class="card-body">
              <div class="grid-2">
                <div class="policy-field"><span class="label">Policy Number</span><span class="value" style="font-family:monospace">{{ newPolicyNumber }}</span></div>
                <div class="policy-field"><span class="label">Plan</span><span class="value">{{ selectedPlan()!.name }}</span></div>
                <div class="policy-field"><span class="label">Cover Amount</span><span class="value">{{ coverAmount | inr }}</span></div>
                <div class="policy-field"><span class="label">Amount Paid</span><span class="value" style="color:var(--success)">{{ calculateTotal() | inr }}</span></div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:24px">
            <a routerLink="/customer/policies" class="btn btn-primary" style="width:auto">View My Policies</a>
            <button class="btn btn-outline" (click)="resetForm()">Buy Another Plan</button>
          </div>
        </div>
      }
    </div>
  `
})
export class BuyPolicyComponent implements OnInit {
  activeTab = signal<string>('ALL');
  allPlans: InsurancePlan[] = [];
  filteredPlans = signal<InsurancePlan[]>([]);
  selectedPlan = signal<InsurancePlan | null>(null);
  step = signal(1);
  purchaseComplete = signal(false);
  isProcessing = signal(false);

  // Form fields
  coverAmount = 500000;
  tenure = 10;
  frequency = 'YEARLY';
  vehicleType = 'FOUR_WHEELER';
  vehicleMake = '';
  vehicleModel = '';
  vehicleRegNo = '';
  nomineeName = '';
  nomineeRelation = '';
  nomineeDob = '';
  nomineeAadhaar = '';
  paymentMethod = 'UPI';
  newPolicyNumber = '';

  constructor(private authService: AuthService, private mockData: MockDataService, private router: Router) {}

  ngOnInit() {
    this.allPlans = this.mockData.getPlans();
    this.filteredPlans.set(this.allPlans);
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    this.filteredPlans.set(tab === 'ALL' ? this.allPlans : this.allPlans.filter(p => p.type === tab));
  }

  selectPlan(plan: InsurancePlan) {
    this.selectedPlan.set(plan);
    this.coverAmount = plan.minCoverAmount;
    this.tenure = plan.tenure[0];
    this.step.set(1);
  }

  getCoverOptions(): number[] {
    const plan = this.selectedPlan();
    if (!plan) return [];
    const options = [];
    let amt = plan.minCoverAmount;
    while (amt <= plan.maxCoverAmount && options.length < 10) {
      options.push(amt);
      amt = amt < 1000000 ? amt + 500000 : amt < 10000000 ? amt + 1000000 : amt + 5000000;
    }
    return options;
  }

  calculatePremium(): number {
    const plan = this.selectedPlan();
    if (!plan) return 0;
    const basePremium = Math.max(plan.minPremium, this.coverAmount * 0.005);
    const freqMultiplier: Record<string, number> = { MONTHLY: 0.09, QUARTERLY: 0.26, HALF_YEARLY: 0.52, YEARLY: 1 };
    return Math.round(basePremium * (freqMultiplier[this.frequency] || 1));
  }

  calculateGST(): number { return Math.round(this.calculatePremium() * 0.18); }
  calculateTotal(): number { return this.calculatePremium() + this.calculateGST(); }

  nextStep() { if (this.step() < 3) this.step.update(s => s + 1); }
  prevStep() { if (this.step() > 1) this.step.update(s => s - 1); }

  completePurchase() {
    this.isProcessing.set(true);
    setTimeout(() => {
      const user = this.authService.user()!;
      const plan = this.selectedPlan()!;
      const now = new Date().toISOString().split('T')[0];
      this.newPolicyNumber = `AON-${plan.type}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + this.tenure);

      const newPolicy: Policy = {
        id: 'POL' + Date.now(), policyNumber: this.newPolicyNumber,
        customerId: user.id, customerName: user.fullName,
        planId: plan.id, planName: plan.name, type: plan.type,
        status: 'ACTIVE', coverAmount: this.coverAmount,
        premiumAmount: this.calculatePremium(),
        paymentFrequency: this.frequency as any,
        startDate: now, endDate: endDate.toISOString().split('T')[0],
        tenure: this.tenure,
        nominees: this.nomineeName ? [{
          name: this.nomineeName, relationship: this.nomineeRelation,
          percentage: 100, dateOfBirth: this.nomineeDob, aadhaarLast4: this.nomineeAadhaar
        }] : [],
        vehicleDetails: plan.type === 'VEHICLE' ? {
          vehicleType: this.vehicleType as any, make: this.vehicleMake,
          model: this.vehicleModel, year: new Date().getFullYear(),
          registrationNumber: this.vehicleRegNo, engineNumber: 'ENG-' + Date.now(),
          chassisNumber: 'CHS-' + Date.now(), fuelType: 'Petrol', rtoCity: user.city || 'Pune'
        } : undefined,
        documents: [], createdAt: now, updatedAt: now
      };
      this.mockData.addPolicy(newPolicy);

      const txn: Transaction = {
        id: 'TXN' + Date.now(),
        transactionId: `AON-TXN-${now.replace(/-/g, '')}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        policyId: newPolicy.id, policyNumber: this.newPolicyNumber,
        customerId: user.id, customerName: user.fullName,
        type: 'PREMIUM_PAYMENT', amount: this.calculatePremium(),
        gstAmount: this.calculateGST(), totalAmount: this.calculateTotal(),
        paymentMethod: this.paymentMethod as any, status: 'SUCCESS',
        description: `Premium - ${plan.name}`, transactionDate: now, createdAt: now
      };
      this.mockData.addTransaction(txn);

      this.isProcessing.set(false);
      this.purchaseComplete.set(true);
    }, 2000);
  }

  resetForm() {
    this.selectedPlan.set(null);
    this.purchaseComplete.set(false);
    this.step.set(1);
    this.nomineeName = '';
    this.nomineeRelation = '';
  }
}
