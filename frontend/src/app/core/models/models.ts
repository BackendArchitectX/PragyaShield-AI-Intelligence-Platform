// ==================== USER & AUTH MODELS ====================
export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  aadhaarMasked?: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profileImage?: string;
  agentCode?: string; // For agents
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  panNumber: string;
  aadhaarLast4: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// ==================== POLICY MODELS ====================
export type PolicyType = 'LIFE' | 'HEALTH' | 'TERM' | 'VEHICLE';
export type PolicyStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED' | 'LAPSED';
export type PaymentFrequency = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export interface InsurancePlan {
  id: string;
  name: string;
  type: PolicyType;
  description: string;
  features: string[];
  minCoverAmount: number;
  maxCoverAmount: number;
  minPremium: number;
  minAge: number;
  maxAge: number;
  tenure: number[]; // in years
  icon: string;
  popularTag?: boolean;
}

export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  agentId?: string;
  agentName?: string;
  planId: string;
  planName: string;
  type: PolicyType;
  status: PolicyStatus;
  coverAmount: number;
  premiumAmount: number;
  paymentFrequency: PaymentFrequency;
  startDate: string;
  endDate: string;
  tenure: number;
  nominees: Nominee[];
  vehicleDetails?: VehicleDetails;
  healthDetails?: HealthDetails;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Nominee {
  name: string;
  relationship: string;
  percentage: number;
  dateOfBirth: string;
  aadhaarLast4: string;
}

export interface VehicleDetails {
  vehicleType: 'TWO_WHEELER' | 'FOUR_WHEELER' | 'COMMERCIAL';
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  rtoCity: string;
}

export interface HealthDetails {
  preExistingConditions: string[];
  smoker: boolean;
  alcoholConsumption: 'NONE' | 'OCCASIONAL' | 'REGULAR';
  bmi: number;
  bloodGroup: string;
  familyHistory: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// ==================== CLAIM MODELS ====================
export type ClaimStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SETTLED' | 'ADDITIONAL_INFO_REQUIRED';

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: PolicyType;
  status: ClaimStatus;
  claimAmount: number;
  approvedAmount?: number;
  reason: string;
  description: string;
  incidentDate: string;
  filingDate: string;
  reviewedBy?: string;
  reviewNotes?: string;
  documents: Document[];
  timeline: ClaimTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface ClaimTimeline {
  status: ClaimStatus;
  date: string;
  note: string;
  updatedBy: string;
}

// ==================== TRANSACTION MODELS ====================
export type TransactionType = 'PREMIUM_PAYMENT' | 'CLAIM_SETTLEMENT' | 'REFUND' | 'GST';
export type PaymentMethod = 'UPI' | 'NETBANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NEFT' | 'AUTO_DEBIT';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: string;
  transactionId: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  description: string;
  receiptUrl?: string;
  transactionDate: string;
  createdAt: string;
}

// ==================== DASHBOARD MODELS ====================
export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  pendingClaims: number;
  totalPremiumPaid: number;
  totalCoverAmount: number;
  upcomingPayments: UpcomingPayment[];
  recentTransactions: Transaction[];
  policyDistribution: { type: string; count: number }[];
}

export interface AgentDashboardStats {
  totalCustomers: number;
  policiesSold: number;
  monthlyTarget: number;
  monthlyAchieved: number;
  commissionEarned: number;
  pendingProposals: number;
  topPlans: { name: string; count: number }[];
}

export interface AdminDashboardStats {
  totalCustomers: number;
  totalAgents: number;
  totalPolicies: number;
  totalRevenue: number;
  pendingClaims: number;
  claimsApproved: number;
  claimsRejected: number;
  monthlyPremiumCollection: { month: string; amount: number }[];
  policyTypeDistribution: { type: string; count: number; revenue: number }[];
}

export interface UpcomingPayment {
  policyNumber: string;
  planName: string;
  amount: number;
  dueDate: string;
  type: PolicyType;
}

// ==================== AGENT MODELS ====================
export interface AgentProfile extends User {
  agentCode: string;
  licenseNumber: string;
  region: string;
  joinDate: string;
  totalPoliciesSold: number;
  rating: number;
  commission: number;
  customers: string[];
}

// ==================== NOTIFICATION MODEL ====================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  read: boolean;
  createdAt: string;
}


// ==================== AI INTEGRATION MODELS ====================
export type AiDecision = 'AUTO_APPROVE' | 'MANUAL_REVIEW' | 'REJECT' | 'REQUEST_DOCUMENTS';
export type AiRiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AiClaimInsight {
  claimId: string;
  claimNumber: string;
  customerName: string;
  policyType: PolicyType;
  claimAmount: number;
  riskScore: number;
  riskBand: AiRiskBand;
  confidence: number;
  recommendedDecision: AiDecision;
  fraudSignals: string[];
  explainability: string[];
  nextBestActions: string[];
  slaHoursRemaining: number;
}

export interface AiUnderwritingSignal {
  proposalId: string;
  applicantName: string;
  product: string;
  predictedPremium: number;
  affordabilityScore: number;
  riskScore: number;
  reasonCodes: string[];
  recommendation: string;
}

export interface AiGovernanceMetric {
  label: string;
  value: string;
  status: 'GOOD' | 'WATCH' | 'RISK';
  description: string;
}

export interface AiExecutiveMetric {
  label: string;
  value: string;
  change: string;
  tone: 'positive' | 'warning' | 'neutral';
  icon: string;
}

// ==================== ASTRACLAIM AI CHATOPS MODELS ====================
export type AiChatSender = 'USER' | 'ASTRACLAIM';
export type AiChatIntent = 'CLAIM_TRIAGE' | 'UNDERWRITING' | 'FRAUD_ANALYSIS' | 'POLICY_RECOMMENDATION' | 'OPERATIONS' | 'GOVERNANCE' | 'GENERAL';

export interface AiToolTrace {
  toolName: string;
  status: 'SUCCESS' | 'SKIPPED' | 'GUARDED';
  latencyMs: number;
  outputSummary: string;
}

export interface AiChatMessage {
  id: string;
  sender: AiChatSender;
  text: string;
  timestamp: string;
  intent?: AiChatIntent;
  confidence?: number;
  retrievalContext?: string[];
  suggestedActions?: string[];
  guardrails?: string[];
  toolTraces?: AiToolTrace[];
}

export interface AiKnowledgeSource {
  name: string;
  type: 'VECTOR_INDEX' | 'RULE_ENGINE' | 'TRANSACTION_STREAM' | 'AUDIT_LEDGER' | 'POLICY_STORE';
  freshness: string;
  description: string;
}

export interface AiCapability {
  keyword: string;
  description: string;
}

