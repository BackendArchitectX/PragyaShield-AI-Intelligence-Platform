import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Transaction } from '../../core/models/models';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InrPipe],
  template: `
    <div class="animate-fade-in">
      <div class="page-title-section">
        <div>
          <h2>Transactions</h2>
          <p class="subtitle">{{ filteredTxns().length }} transactions</p>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-icon green"><span class="material-icons-outlined">check_circle</span></div>
          <div class="stat-details">
            <h4>Successful</h4>
            <div class="value">{{ getSuccessTotal() | inr }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><span class="material-icons-outlined">cancel</span></div>
          <div class="stat-details">
            <h4>Failed</h4>
            <div class="value">{{ getFailedTotal() | inr }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><span class="material-icons-outlined">receipt</span></div>
          <div class="stat-details">
            <h4>Total Transactions</h4>
            <div class="value">{{ allTxns.length }}</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-input">
          <span class="material-icons-outlined">search</span>
          <input type="text" placeholder="Search transactions..." [(ngModel)]="searchTerm" (input)="filter()">
        </div>
        <select class="filter-select" [(ngModel)]="typeFilter" (change)="filter()">
          <option value="">All Types</option>
          <option value="PREMIUM_PAYMENT">Premium Payment</option>
          <option value="CLAIM_SETTLEMENT">Claim Settlement</option>
          <option value="REFUND">Refund</option>
        </select>
        <select class="filter-select" [(ngModel)]="statusFilter" (change)="filter()">
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="card-body" style="padding:0;overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                @if (isAdmin) { <th>Customer</th> }
                <th>Policy</th>
                <th>Type</th>
                <th>Amount</th>
                <th>GST</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (txn of filteredTxns(); track txn.id) {
                <tr>
                  <td style="font-family:monospace;font-size:11px">{{ txn.transactionId }}</td>
                  @if (isAdmin) { <td>{{ txn.customerName }}</td> }
                  <td style="font-size:12px">{{ txn.policyNumber }}</td>
                  <td>
                    <span style="display:flex;align-items:center;gap:4px">
                      <span class="material-icons-outlined" style="font-size:16px"
                            [style.color]="txn.type === 'PREMIUM_PAYMENT' ? 'var(--primary)' : txn.type === 'CLAIM_SETTLEMENT' ? 'var(--success)' : 'var(--warning)'">
                        {{ txn.type === 'PREMIUM_PAYMENT' ? 'payments' : txn.type === 'CLAIM_SETTLEMENT' ? 'savings' : 'undo' }}
                      </span>
                      {{ formatType(txn.type) }}
                    </span>
                  </td>
                  <td>{{ txn.amount | inr }}</td>
                  <td style="color:var(--text-muted)">{{ txn.gstAmount | inr }}</td>
                  <td style="font-weight:700">{{ txn.totalAmount | inr }}</td>
                  <td>
                    <span style="font-size:12px;padding:3px 8px;background:var(--bg);border-radius:4px;font-weight:600">{{ txn.paymentMethod }}</span>
                  </td>
                  <td><span class="badge-status" [class]="'badge-' + txn.status.toLowerCase()">{{ txn.status }}</span></td>
                  <td>{{ txn.transactionDate }}</td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredTxns().length === 0) {
            <div class="empty-state"><div class="icon">💳</div><h3>No Transactions</h3></div>
          }
        </div>
      </div>
    </div>
  `
})
export class TransactionListComponent implements OnInit {
  allTxns: Transaction[] = [];
  filteredTxns = signal<Transaction[]>([]);
  searchTerm = '';
  typeFilter = '';
  statusFilter = '';
  isAdmin = false;

  constructor(private authService: AuthService, private mockData: MockDataService) {}

  ngOnInit() {
    this.isAdmin = this.authService.userRole() === 'ADMIN';
    if (this.isAdmin) {
      this.allTxns = this.mockData.getTransactions();
    } else {
      this.allTxns = this.mockData.getTransactionsByCustomer(this.authService.user()?.id || '');
    }
    this.filteredTxns.set(this.allTxns);
  }

  filter() {
    let result = [...this.allTxns];
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      result = result.filter(x => x.transactionId.toLowerCase().includes(t) || x.policyNumber.toLowerCase().includes(t) || x.customerName.toLowerCase().includes(t));
    }
    if (this.typeFilter) result = result.filter(x => x.type === this.typeFilter);
    if (this.statusFilter) result = result.filter(x => x.status === this.statusFilter);
    this.filteredTxns.set(result);
  }

  formatType(type: string): string { return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }
  getSuccessTotal(): number { return this.allTxns.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.totalAmount, 0); }
  getFailedTotal(): number { return this.allTxns.filter(t => t.status === 'FAILED').reduce((s, t) => s + t.totalAmount, 0); }
}
