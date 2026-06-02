import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  // Customer Routes
  {
    path: 'customer',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
      { path: 'policies', loadComponent: () => import('./features/policy/policy-list.component').then(m => m.PolicyListComponent) },
      { path: 'buy-policy', loadComponent: () => import('./features/policy/buy-policy.component').then(m => m.BuyPolicyComponent) },
      { path: 'claims', loadComponent: () => import('./features/claims/claim-list.component').then(m => m.ClaimListComponent) },
      { path: 'file-claim', loadComponent: () => import('./features/claims/file-claim.component').then(m => m.FileClaimComponent) },
      { path: 'transactions', loadComponent: () => import('./features/transactions/transaction-list.component').then(m => m.TransactionListComponent) },
      { path: 'ai-command-center', loadComponent: () => import('./features/ai/ai-command-center.component').then(m => m.AiCommandCenterComponent) },
      { path: 'astraclaim-chatops', loadComponent: () => import('./features/ai-chatbot/astraclaim-chatops.component').then(m => m.AstraClaimChatOpsComponent) },
    ]
  },
  // Agent Routes
  {
    path: 'agent',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    data: { role: 'AGENT' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/agent/agent-dashboard.component').then(m => m.AgentDashboardComponent) },
      { path: 'customers', loadComponent: () => import('./features/agent/agent-customers.component').then(m => m.AgentCustomersComponent) },
      { path: 'policies', loadComponent: () => import('./features/policy/policy-list.component').then(m => m.PolicyListComponent) },
      { path: 'ai-command-center', loadComponent: () => import('./features/ai/ai-command-center.component').then(m => m.AiCommandCenterComponent) },
      { path: 'astraclaim-chatops', loadComponent: () => import('./features/ai-chatbot/astraclaim-chatops.component').then(m => m.AstraClaimChatOpsComponent) },
    ]
  },
  // Admin Routes
  {
    path: 'admin',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'claims', loadComponent: () => import('./features/admin/admin-claims.component').then(m => m.AdminClaimsComponent) },
      { path: 'policies', loadComponent: () => import('./features/policy/policy-list.component').then(m => m.PolicyListComponent) },
      { path: 'agents', loadComponent: () => import('./features/admin/admin-agents.component').then(m => m.AdminAgentsComponent) },
      { path: 'transactions', loadComponent: () => import('./features/transactions/transaction-list.component').then(m => m.TransactionListComponent) },
      { path: 'ai-command-center', loadComponent: () => import('./features/ai/ai-command-center.component').then(m => m.AiCommandCenterComponent) },
      { path: 'astraclaim-chatops', loadComponent: () => import('./features/ai-chatbot/astraclaim-chatops.component').then(m => m.AstraClaimChatOpsComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
