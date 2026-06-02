import { Injectable } from '@angular/core';
import {
  User, Policy, Claim, Transaction, InsurancePlan, DashboardStats,
  AgentDashboardStats, AdminDashboardStats, Notification, PolicyType,
  ClaimStatus, PolicyStatus, TransactionStatus
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  // ==================== USERS ====================
  private users: User[] = [
    {
      id: 'CUST001', fullName: 'Rajesh Kumar Sharma', email: 'rajesh@email.com',
      phone: '9876543210', role: 'CUSTOMER', aadhaarMasked: 'XXXX-XXXX-4521',
      panNumber: 'ABCDE1234F', address: '45 MG Road, Koregaon Park', city: 'Pune',
      state: 'Maharashtra', pincode: '411001', dateOfBirth: '1990-05-15', gender: 'Male',
      isActive: true, createdAt: '2024-01-15'
    },
    {
      id: 'CUST002', fullName: 'Priya Mehta', email: 'priya@email.com',
      phone: '9876543211', role: 'CUSTOMER', aadhaarMasked: 'XXXX-XXXX-7832',
      panNumber: 'FGHIJ5678K', address: '12 Bandra West', city: 'Mumbai',
      state: 'Maharashtra', pincode: '400050', dateOfBirth: '1988-09-22', gender: 'Female',
      isActive: true, createdAt: '2024-02-10'
    },
    {
      id: 'CUST003', fullName: 'Amit Patel', email: 'amit@email.com',
      phone: '9876543212', role: 'CUSTOMER', aadhaarMasked: 'XXXX-XXXX-9012',
      panNumber: 'KLMNO9012P', address: '78 Ashram Road', city: 'Ahmedabad',
      state: 'Gujarat', pincode: '380009', dateOfBirth: '1985-12-01', gender: 'Male',
      isActive: true, createdAt: '2024-03-05'
    },
    {
      id: 'AGT001', fullName: 'Suresh Nair', email: 'agent@email.com',
      phone: '9876543220', role: 'AGENT', agentCode: 'AGT-MH-001',
      address: '23 FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005',
      isActive: true, createdAt: '2023-06-01'
    },
    {
      id: 'AGT002', fullName: 'Meena Iyer', email: 'meena.agent@email.com',
      phone: '9876543221', role: 'AGENT', agentCode: 'AGT-MH-002',
      address: '56 Viman Nagar', city: 'Pune', state: 'Maharashtra', pincode: '411014',
      isActive: true, createdAt: '2023-08-15'
    },
    {
      id: 'ADM001', fullName: 'Admin PragyaShield', email: 'admin@email.com',
      phone: '9876543200', role: 'ADMIN',
      address: 'PragyaShield Insurance HQ, BKC', city: 'Mumbai', state: 'Maharashtra',
      pincode: '400051', isActive: true, createdAt: '2023-01-01'
    }
  ];

  // ==================== INSURANCE PLANS ====================
  private plans: InsurancePlan[] = [
    {
      id: 'PLAN-LIFE-001', name: 'PragyaShield Jeevan Plus', type: 'LIFE',
      description: 'Comprehensive life insurance with guaranteed returns and tax benefits under Sec 80C. Ideal for long-term wealth creation.',
      features: ['Guaranteed Maturity Benefit', 'Death Benefit: 10x Annual Premium', 'Tax Benefits u/s 80C & 10(10D)', 'Loan Facility Available', 'Flexible Premium Payment Terms', 'Bonus Additions'],
      minCoverAmount: 500000, maxCoverAmount: 50000000, minPremium: 5000,
      minAge: 18, maxAge: 65, tenure: [10, 15, 20, 25, 30], icon: '🛡️', popularTag: true
    },
    {
      id: 'PLAN-LIFE-002', name: 'PragyaShield Wealth Builder', type: 'LIFE',
      description: 'Unit-linked insurance plan combining insurance with market-linked growth potential.',
      features: ['Market-Linked Returns', 'Multiple Fund Options', 'Partial Withdrawal After 5 Years', 'Switch Between Funds Free', 'Loyalty Additions', 'Tax Benefits u/s 80C'],
      minCoverAmount: 300000, maxCoverAmount: 100000000, minPremium: 10000,
      minAge: 18, maxAge: 55, tenure: [10, 15, 20], icon: '📈'
    },
    {
      id: 'PLAN-HEALTH-001', name: 'PragyaShield Health Shield', type: 'HEALTH',
      description: 'Complete health protection for you and your family. Covers hospitalization, daycare procedures, and more.',
      features: ['Cashless Treatment at 5000+ Hospitals', 'No Room Rent Capping', 'Pre & Post Hospitalization Cover', 'Daycare Procedures Covered', 'Annual Health Check-up', 'No Claim Bonus: 10% p.a.', 'AYUSH Treatment Covered'],
      minCoverAmount: 300000, maxCoverAmount: 10000000, minPremium: 4000,
      minAge: 18, maxAge: 65, tenure: [1, 2, 3], icon: '🏥', popularTag: true
    },
    {
      id: 'PLAN-HEALTH-002', name: 'PragyaShield Family Floater', type: 'HEALTH',
      description: 'Single policy covering your entire family. Shared sum insured with individual benefits.',
      features: ['Cover Spouse + 2 Children', 'Shared Sum Insured', 'Maternity Cover Available', 'New Born Baby Cover', 'No Claim Bonus: 20% p.a.', 'Restoration Benefit'],
      minCoverAmount: 500000, maxCoverAmount: 25000000, minPremium: 8000,
      minAge: 18, maxAge: 60, tenure: [1, 2, 3], icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'PLAN-TERM-001', name: 'PragyaShield Term Protect', type: 'TERM',
      description: 'Pure term insurance with highest cover at lowest premium. Secure your family\'s future today.',
      features: ['Cover up to ₹5 Crore', 'Premium Starts at ₹490/month', 'Terminal Illness Benefit', 'Accidental Death Benefit', 'Critical Illness Rider', 'Premium Waiver on Disability'],
      minCoverAmount: 2500000, maxCoverAmount: 50000000, minPremium: 5880,
      minAge: 18, maxAge: 65, tenure: [10, 15, 20, 25, 30, 35], icon: '⚡', popularTag: true
    },
    {
      id: 'PLAN-TERM-002', name: 'PragyaShield iProtect Smart', type: 'TERM',
      description: 'Smart term plan with return of premium option. Get back all premiums paid if you survive the term.',
      features: ['Return of Premium on Survival', 'Increasing Cover Option', 'Lump Sum + Monthly Income', 'Joint Life Option', 'Tax Benefits u/s 80C'],
      minCoverAmount: 5000000, maxCoverAmount: 100000000, minPremium: 12000,
      minAge: 21, maxAge: 55, tenure: [15, 20, 25, 30], icon: '🔄'
    },
    {
      id: 'PLAN-VEH-001', name: 'PragyaShield Motor Comprehensive', type: 'VEHICLE',
      description: 'Complete protection for your car against accidents, theft, natural calamities, and third-party liability.',
      features: ['Own Damage + Third Party Cover', 'Cashless Repairs at 4000+ Garages', 'Personal Accident Cover ₹15 Lakh', 'Zero Depreciation Add-on', 'Roadside Assistance 24x7', 'Engine Protect Add-on', 'NCB Transfer Benefit'],
      minCoverAmount: 100000, maxCoverAmount: 5000000, minPremium: 3000,
      minAge: 18, maxAge: 75, tenure: [1], icon: '🚗', popularTag: true
    },
    {
      id: 'PLAN-VEH-002', name: 'PragyaShield Two-Wheeler Shield', type: 'VEHICLE',
      description: 'Affordable protection for your two-wheeler. Comprehensive + third party coverage.',
      features: ['Own Damage Cover', 'Third Party Liability', 'Personal Accident Cover', 'Theft Protection', 'Natural Calamity Cover', 'Pillion Rider Cover'],
      minCoverAmount: 20000, maxCoverAmount: 500000, minPremium: 800,
      minAge: 18, maxAge: 75, tenure: [1], icon: '🏍️'
    }
  ];

  // ==================== POLICIES ====================
  private policies: Policy[] = [
    {
      id: 'POL001', policyNumber: 'AON-LIFE-2024-00001', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', agentId: 'AGT001', agentName: 'Suresh Nair',
      planId: 'PLAN-LIFE-001', planName: 'PragyaShield Jeevan Plus', type: 'LIFE',
      status: 'ACTIVE', coverAmount: 5000000, premiumAmount: 25000,
      paymentFrequency: 'QUARTERLY', startDate: '2024-03-01', endDate: '2044-03-01',
      tenure: 20, nominees: [{ name: 'Sunita Sharma', relationship: 'Spouse', percentage: 60, dateOfBirth: '1992-08-10', aadhaarLast4: '5678' },
        { name: 'Aarav Sharma', relationship: 'Son', percentage: 40, dateOfBirth: '2015-02-20', aadhaarLast4: '9012' }],
      documents: [], createdAt: '2024-03-01', updatedAt: '2024-03-01'
    },
    {
      id: 'POL002', policyNumber: 'AON-HEALTH-2024-00002', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', agentId: 'AGT001', agentName: 'Suresh Nair',
      planId: 'PLAN-HEALTH-001', planName: 'PragyaShield Health Shield', type: 'HEALTH',
      status: 'ACTIVE', coverAmount: 1000000, premiumAmount: 12000,
      paymentFrequency: 'YEARLY', startDate: '2024-06-15', endDate: '2025-06-15',
      tenure: 1, nominees: [{ name: 'Sunita Sharma', relationship: 'Spouse', percentage: 100, dateOfBirth: '1992-08-10', aadhaarLast4: '5678' }],
      healthDetails: { preExistingConditions: [], smoker: false, alcoholConsumption: 'NONE', bmi: 24.5, bloodGroup: 'B+', familyHistory: ['Diabetes'] },
      documents: [], createdAt: '2024-06-15', updatedAt: '2024-06-15'
    },
    {
      id: 'POL003', policyNumber: 'AON-TERM-2024-00003', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', planId: 'PLAN-TERM-001',
      planName: 'PragyaShield Term Protect', type: 'TERM', status: 'ACTIVE',
      coverAmount: 10000000, premiumAmount: 8500, paymentFrequency: 'YEARLY',
      startDate: '2024-01-10', endDate: '2054-01-10', tenure: 30,
      nominees: [{ name: 'Sunita Sharma', relationship: 'Spouse', percentage: 100, dateOfBirth: '1992-08-10', aadhaarLast4: '5678' }],
      documents: [], createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
      id: 'POL004', policyNumber: 'AON-VEH-2024-00004', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', planId: 'PLAN-VEH-001',
      planName: 'PragyaShield Motor Comprehensive', type: 'VEHICLE', status: 'ACTIVE',
      coverAmount: 800000, premiumAmount: 15000, paymentFrequency: 'YEARLY',
      startDate: '2024-08-01', endDate: '2025-08-01', tenure: 1,
      nominees: [], vehicleDetails: {
        vehicleType: 'FOUR_WHEELER', make: 'Maruti Suzuki', model: 'Swift Dzire',
        year: 2023, registrationNumber: 'MH-12-AB-1234', engineNumber: 'K12M-9876543',
        chassisNumber: 'MA3FJEB1S00-123456', fuelType: 'Petrol', rtoCity: 'Pune'
      },
      documents: [], createdAt: '2024-08-01', updatedAt: '2024-08-01'
    },
    {
      id: 'POL005', policyNumber: 'AON-HEALTH-2024-00005', customerId: 'CUST002',
      customerName: 'Priya Mehta', agentId: 'AGT002', agentName: 'Meena Iyer',
      planId: 'PLAN-HEALTH-002', planName: 'PragyaShield Family Floater', type: 'HEALTH',
      status: 'ACTIVE', coverAmount: 2500000, premiumAmount: 18000,
      paymentFrequency: 'YEARLY', startDate: '2024-04-01', endDate: '2025-04-01',
      tenure: 1, nominees: [{ name: 'Vikram Mehta', relationship: 'Spouse', percentage: 100, dateOfBirth: '1986-03-15', aadhaarLast4: '3456' }],
      documents: [], createdAt: '2024-04-01', updatedAt: '2024-04-01'
    },
    {
      id: 'POL006', policyNumber: 'AON-LIFE-2024-00006', customerId: 'CUST003',
      customerName: 'Amit Patel', agentId: 'AGT001', agentName: 'Suresh Nair',
      planId: 'PLAN-LIFE-002', planName: 'PragyaShield Wealth Builder', type: 'LIFE',
      status: 'PENDING', coverAmount: 3000000, premiumAmount: 30000,
      paymentFrequency: 'YEARLY', startDate: '2025-01-01', endDate: '2040-01-01',
      tenure: 15, nominees: [{ name: 'Riya Patel', relationship: 'Spouse', percentage: 100, dateOfBirth: '1988-07-25', aadhaarLast4: '7890' }],
      documents: [], createdAt: '2025-01-01', updatedAt: '2025-01-01'
    }
  ];

  // ==================== CLAIMS ====================
  private claims: Claim[] = [
    {
      id: 'CLM001', claimNumber: 'AON-CLM-2025-00001', policyId: 'POL002',
      policyNumber: 'AON-HEALTH-2024-00002', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'HEALTH', status: 'SUBMITTED',
      claimAmount: 150000, reason: 'Hospitalization - Knee Surgery',
      description: 'Underwent arthroscopic knee surgery at Ruby Hall Clinic, Pune. Admitted for 3 days. All hospital bills and doctor consultation receipts attached.',
      incidentDate: '2025-02-15', filingDate: '2025-02-20',
      documents: [{ id: 'DOC001', name: 'Hospital Bill.pdf', type: 'BILL', url: '#', uploadedAt: '2025-02-20' },
        { id: 'DOC002', name: 'Discharge Summary.pdf', type: 'MEDICAL', url: '#', uploadedAt: '2025-02-20' }],
      timeline: [{ status: 'SUBMITTED', date: '2025-02-20', note: 'Claim submitted with all documents', updatedBy: 'CUST001' }],
      createdAt: '2025-02-20', updatedAt: '2025-02-20'
    },
    {
      id: 'CLM002', claimNumber: 'AON-CLM-2025-00002', policyId: 'POL004',
      policyNumber: 'AON-VEH-2024-00004', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'VEHICLE', status: 'UNDER_REVIEW',
      claimAmount: 45000, reason: 'Vehicle Accident - Front Bumper Damage',
      description: 'Minor accident on Pune-Mumbai Expressway. Front bumper and headlight damaged. FIR copy and repair estimate from authorized service center attached.',
      incidentDate: '2025-01-10', filingDate: '2025-01-12',
      documents: [{ id: 'DOC003', name: 'FIR Copy.pdf', type: 'LEGAL', url: '#', uploadedAt: '2025-01-12' },
        { id: 'DOC004', name: 'Repair Estimate.pdf', type: 'BILL', url: '#', uploadedAt: '2025-01-12' },
        { id: 'DOC005', name: 'Accident Photos.zip', type: 'PHOTO', url: '#', uploadedAt: '2025-01-12' }],
      timeline: [
        { status: 'SUBMITTED', date: '2025-01-12', note: 'Claim submitted', updatedBy: 'CUST001' },
        { status: 'UNDER_REVIEW', date: '2025-01-15', note: 'Assigned to surveyor for inspection', updatedBy: 'ADM001' }
      ],
      createdAt: '2025-01-12', updatedAt: '2025-01-15'
    },
    {
      id: 'CLM003', claimNumber: 'AON-CLM-2025-00003', policyId: 'POL005',
      policyNumber: 'AON-HEALTH-2024-00005', customerId: 'CUST002',
      customerName: 'Priya Mehta', type: 'HEALTH', status: 'APPROVED',
      claimAmount: 200000, approvedAmount: 185000, reason: 'Hospitalization - Appendectomy',
      description: 'Emergency appendectomy surgery at Lilavati Hospital, Mumbai.',
      incidentDate: '2025-01-25', filingDate: '2025-01-28', reviewedBy: 'ADM001',
      reviewNotes: 'All documents verified. Amount approved after deducting non-admissible charges (₹15,000 for non-medical consumables).',
      documents: [{ id: 'DOC006', name: 'Hospital Bill.pdf', type: 'BILL', url: '#', uploadedAt: '2025-01-28' }],
      timeline: [
        { status: 'SUBMITTED', date: '2025-01-28', note: 'Claim submitted', updatedBy: 'CUST002' },
        { status: 'UNDER_REVIEW', date: '2025-01-30', note: 'Under review by claims team', updatedBy: 'ADM001' },
        { status: 'APPROVED', date: '2025-02-05', note: 'Claim approved for ₹1,85,000', updatedBy: 'ADM001' }
      ],
      createdAt: '2025-01-28', updatedAt: '2025-02-05'
    },
    {
      id: 'CLM004', claimNumber: 'AON-CLM-2025-00004', policyId: 'POL005',
      policyNumber: 'AON-HEALTH-2024-00005', customerId: 'CUST002',
      customerName: 'Priya Mehta', type: 'HEALTH', status: 'REJECTED',
      claimAmount: 50000, reason: 'OPD Dental Treatment',
      description: 'Root canal treatment and dental crowns at dental clinic.',
      incidentDate: '2025-03-01', filingDate: '2025-03-05', reviewedBy: 'ADM001',
      reviewNotes: 'Dental OPD treatment not covered under the Family Floater plan. Only inpatient hospitalization is covered.',
      documents: [{ id: 'DOC007', name: 'Dental Bill.pdf', type: 'BILL', url: '#', uploadedAt: '2025-03-05' }],
      timeline: [
        { status: 'SUBMITTED', date: '2025-03-05', note: 'Claim submitted', updatedBy: 'CUST002' },
        { status: 'REJECTED', date: '2025-03-08', note: 'Not covered under policy terms', updatedBy: 'ADM001' }
      ],
      createdAt: '2025-03-05', updatedAt: '2025-03-08'
    }
  ];

  // ==================== TRANSACTIONS ====================
  private transactions: Transaction[] = [
    {
      id: 'TXN001', transactionId: 'AON-TXN-20240301-001', policyId: 'POL001',
      policyNumber: 'AON-LIFE-2024-00001', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 25000, gstAmount: 4500, totalAmount: 29500,
      paymentMethod: 'UPI', status: 'SUCCESS',
      description: 'Q1 Premium - PragyaShield Jeevan Plus', transactionDate: '2024-03-01', createdAt: '2024-03-01'
    },
    {
      id: 'TXN002', transactionId: 'AON-TXN-20240601-002', policyId: 'POL001',
      policyNumber: 'AON-LIFE-2024-00001', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 25000, gstAmount: 4500, totalAmount: 29500,
      paymentMethod: 'NETBANKING', status: 'SUCCESS',
      description: 'Q2 Premium - PragyaShield Jeevan Plus', transactionDate: '2024-06-01', createdAt: '2024-06-01'
    },
    {
      id: 'TXN003', transactionId: 'AON-TXN-20240615-003', policyId: 'POL002',
      policyNumber: 'AON-HEALTH-2024-00002', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 12000, gstAmount: 2160, totalAmount: 14160,
      paymentMethod: 'CREDIT_CARD', status: 'SUCCESS',
      description: 'Annual Premium - PragyaShield Health Shield', transactionDate: '2024-06-15', createdAt: '2024-06-15'
    },
    {
      id: 'TXN004', transactionId: 'AON-TXN-20240110-004', policyId: 'POL003',
      policyNumber: 'AON-TERM-2024-00003', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 8500, gstAmount: 1530, totalAmount: 10030,
      paymentMethod: 'AUTO_DEBIT', status: 'SUCCESS',
      description: 'Annual Premium - PragyaShield Term Protect', transactionDate: '2024-01-10', createdAt: '2024-01-10'
    },
    {
      id: 'TXN005', transactionId: 'AON-TXN-20250205-005', policyId: 'POL005',
      policyNumber: 'AON-HEALTH-2024-00005', customerId: 'CUST002',
      customerName: 'Priya Mehta', type: 'CLAIM_SETTLEMENT',
      amount: 185000, gstAmount: 0, totalAmount: 185000,
      paymentMethod: 'NEFT', status: 'SUCCESS',
      description: 'Claim Settlement - CLM003 Appendectomy', transactionDate: '2025-02-10', createdAt: '2025-02-10'
    },
    {
      id: 'TXN006', transactionId: 'AON-TXN-20240901-006', policyId: 'POL001',
      policyNumber: 'AON-LIFE-2024-00001', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 25000, gstAmount: 4500, totalAmount: 29500,
      paymentMethod: 'UPI', status: 'SUCCESS',
      description: 'Q3 Premium - PragyaShield Jeevan Plus', transactionDate: '2024-09-01', createdAt: '2024-09-01'
    },
    {
      id: 'TXN007', transactionId: 'AON-TXN-20241201-007', policyId: 'POL001',
      policyNumber: 'AON-LIFE-2024-00001', customerId: 'CUST001',
      customerName: 'Rajesh Kumar Sharma', type: 'PREMIUM_PAYMENT',
      amount: 25000, gstAmount: 4500, totalAmount: 29500,
      paymentMethod: 'UPI', status: 'FAILED',
      description: 'Q4 Premium - PragyaShield Jeevan Plus (Payment Failed)', transactionDate: '2024-12-01', createdAt: '2024-12-01'
    }
  ];

  // ==================== NOTIFICATIONS ====================
  private notifications: Notification[] = [
    { id: 'N001', title: 'Premium Due', message: 'Your Q4 premium for PragyaShield Jeevan Plus (₹29,500) is overdue.', type: 'WARNING', read: false, createdAt: '2025-03-01' },
    { id: 'N002', title: 'Claim Update', message: 'Your health claim CLM001 has been received and is being processed.', type: 'INFO', read: false, createdAt: '2025-02-20' },
    { id: 'N003', title: 'Policy Renewed', message: 'Your Health Shield policy has been successfully renewed for 2025-26.', type: 'SUCCESS', read: true, createdAt: '2025-06-15' },
    { id: 'N004', title: 'Vehicle Claim Update', message: 'Your vehicle claim CLM002 is under review. Surveyor assigned.', type: 'INFO', read: false, createdAt: '2025-01-15' }
  ];

  // ==================== PUBLIC METHODS ====================
  getUsers(): User[] { return this.users; }
  getUserById(id: string): User | undefined { return this.users.find(u => u.id === id); }
  getUserByEmail(email: string): User | undefined { return this.users.find(u => u.email === email); }

  getPlans(): InsurancePlan[] { return this.plans; }
  getPlansByType(type: PolicyType): InsurancePlan[] { return this.plans.filter(p => p.type === type); }
  getPlanById(id: string): InsurancePlan | undefined { return this.plans.find(p => p.id === id); }

  getPolicies(): Policy[] { return this.policies; }
  getPoliciesByCustomer(customerId: string): Policy[] { return this.policies.filter(p => p.customerId === customerId); }
  getPoliciesByAgent(agentId: string): Policy[] { return this.policies.filter(p => p.agentId === agentId); }
  getPolicyById(id: string): Policy | undefined { return this.policies.find(p => p.id === id); }

  getClaims(): Claim[] { return this.claims; }
  getClaimsByCustomer(customerId: string): Claim[] { return this.claims.filter(c => c.customerId === customerId); }
  getClaimsByStatus(status: ClaimStatus): Claim[] { return this.claims.filter(c => c.status === status); }
  getClaimById(id: string): Claim | undefined { return this.claims.find(c => c.id === id); }

  getTransactions(): Transaction[] { return this.transactions; }
  getTransactionsByCustomer(customerId: string): Transaction[] { return this.transactions.filter(t => t.customerId === customerId); }

  getNotifications(): Notification[] { return this.notifications; }

  addPolicy(policy: Policy): void { this.policies.push(policy); }
  addClaim(claim: Claim): void { this.claims.push(claim); }
  addTransaction(txn: Transaction): void { this.transactions.push(txn); }

  updateClaimStatus(claimId: string, status: ClaimStatus, notes: string, reviewerId: string, approvedAmount?: number): Claim | undefined {
    const claim = this.claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = status;
      claim.reviewNotes = notes;
      claim.reviewedBy = reviewerId;
      if (approvedAmount !== undefined) claim.approvedAmount = approvedAmount;
      claim.timeline.push({ status, date: new Date().toISOString().split('T')[0], note: notes, updatedBy: reviewerId });
      claim.updatedAt = new Date().toISOString().split('T')[0];
    }
    return claim;
  }

  // Dashboard Stats
  getCustomerDashboard(customerId: string): DashboardStats {
    const myPolicies = this.getPoliciesByCustomer(customerId);
    const myTransactions = this.getTransactionsByCustomer(customerId);
    const myClaims = this.getClaimsByCustomer(customerId);
    return {
      totalPolicies: myPolicies.length,
      activePolicies: myPolicies.filter(p => p.status === 'ACTIVE').length,
      pendingClaims: myClaims.filter(c => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length,
      totalPremiumPaid: myTransactions.filter(t => t.type === 'PREMIUM_PAYMENT' && t.status === 'SUCCESS').reduce((sum, t) => sum + t.totalAmount, 0),
      totalCoverAmount: myPolicies.filter(p => p.status === 'ACTIVE').reduce((sum, p) => sum + p.coverAmount, 0),
      upcomingPayments: [
        { policyNumber: 'AON-LIFE-2024-00001', planName: 'PragyaShield Jeevan Plus', amount: 29500, dueDate: '2025-03-01', type: 'LIFE' as PolicyType },
        { policyNumber: 'AON-HEALTH-2024-00002', planName: 'PragyaShield Health Shield', amount: 14160, dueDate: '2025-06-15', type: 'HEALTH' as PolicyType }
      ],
      recentTransactions: myTransactions.slice(0, 5),
      policyDistribution: [
        { type: 'Life', count: myPolicies.filter(p => p.type === 'LIFE').length },
        { type: 'Health', count: myPolicies.filter(p => p.type === 'HEALTH').length },
        { type: 'Term', count: myPolicies.filter(p => p.type === 'TERM').length },
        { type: 'Vehicle', count: myPolicies.filter(p => p.type === 'VEHICLE').length }
      ]
    };
  }

  getAdminDashboard(): AdminDashboardStats {
    return {
      totalCustomers: this.users.filter(u => u.role === 'CUSTOMER').length,
      totalAgents: this.users.filter(u => u.role === 'AGENT').length,
      totalPolicies: this.policies.length,
      totalRevenue: this.transactions.filter(t => t.status === 'SUCCESS' && t.type === 'PREMIUM_PAYMENT').reduce((s, t) => s + t.totalAmount, 0),
      pendingClaims: this.claims.filter(c => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length,
      claimsApproved: this.claims.filter(c => c.status === 'APPROVED' || c.status === 'SETTLED').length,
      claimsRejected: this.claims.filter(c => c.status === 'REJECTED').length,
      monthlyPremiumCollection: [
        { month: 'Jan', amount: 10030 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 29500 },
        { month: 'Apr', amount: 18000 }, { month: 'May', amount: 0 }, { month: 'Jun', amount: 43660 },
        { month: 'Jul', amount: 0 }, { month: 'Aug', amount: 15000 }, { month: 'Sep', amount: 29500 },
        { month: 'Oct', amount: 0 }, { month: 'Nov', amount: 0 }, { month: 'Dec', amount: 0 }
      ],
      policyTypeDistribution: [
        { type: 'Life', count: 3, revenue: 88500 }, { type: 'Health', count: 2, revenue: 32160 },
        { type: 'Term', count: 1, revenue: 10030 }, { type: 'Vehicle', count: 1, revenue: 15000 }
      ]
    };
  }

  getAgentDashboard(agentId: string): AgentDashboardStats {
    const agentPolicies = this.getPoliciesByAgent(agentId);
    return {
      totalCustomers: new Set(agentPolicies.map(p => p.customerId)).size,
      policiesSold: agentPolicies.length,
      monthlyTarget: 500000,
      monthlyAchieved: 320000,
      commissionEarned: 45000,
      pendingProposals: agentPolicies.filter(p => p.status === 'PENDING').length,
      topPlans: [
        { name: 'PragyaShield Jeevan Plus', count: 12 },
        { name: 'PragyaShield Health Shield', count: 8 },
        { name: 'PragyaShield Term Protect', count: 6 }
      ]
    };
  }
}
