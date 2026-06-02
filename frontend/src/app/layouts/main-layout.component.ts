import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AstraClaimFloatingChatComponent } from '../shared/components/astra-claim-floating-chat.component';
import { filter } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AstraClaimFloatingChatComponent],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <span class="sidebar-logo">🛡️</span>
          <div>
            <h2>PragyaShield</h2>
            <span class="role-badge">{{ authService.userRole() }}</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          @for (section of navSections(); track section.title) {
            <div class="nav-section">
              <div class="nav-section-title">{{ section.title }}</div>
              @for (item of section.items; track item.route) {
                <a class="nav-item" [routerLink]="item.route" routerLinkActive="active"
                   (click)="sidebarOpen.set(false)">
                  <span class="material-icons-outlined">{{ item.icon }}</span>
                  {{ item.label }}
                  @if (item.badge) {
                    <span class="badge">{{ item.badge }}</span>
                  }
                </a>
              }
            </div>
          }
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ getInitials() }}</div>
            <div class="user-details">
              <div class="name">{{ authService.user()?.fullName }}</div>
              <div class="role">{{ getRoleDisplay() }}</div>
            </div>
            <button class="logout-btn" (click)="logout()" title="Logout">
              <span class="material-icons-outlined" style="font-size:20px">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="main-header">
          <div style="display:flex;align-items:center;gap:12px">
            <button class="btn-icon btn-outline" style="display:none" (click)="sidebarOpen.set(!sidebarOpen())">
              <span class="material-icons-outlined">menu</span>
            </button>
            <h1>{{ pageTitle() }}</h1>
          </div>
          <div class="header-actions">
            <button class="notification-btn">
              <span class="material-icons-outlined">notifications</span>
              <span class="notification-dot"></span>
            </button>
            <div style="display:flex;align-items:center;gap:8px;padding-left:12px;border-left:1px solid var(--border)">
              <div class="user-avatar" style="width:34px;height:34px;font-size:13px">{{ getInitials() }}</div>
              <span style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ getFirstName() }}</span>
            </div>
          </div>
        </header>

        <div class="page-content">
          <router-outlet />
        </div>
      </main>
      <app-astra-claim-floating-chat />
    </div>
  `
})
export class MainLayoutComponent {
  sidebarOpen = signal(false);
  pageTitle = signal('Dashboard');

  navSections = computed<NavSection[]>(() => {
    const role = this.authService.userRole();
    switch (role) {
      case 'CUSTOMER':
        return [
          {
            title: 'Overview', items: [
              { label: 'Dashboard', icon: 'dashboard', route: '/customer/dashboard' }
            ]
          },
          {
            title: 'Insurance', items: [
              { label: 'My Policies', icon: 'verified_user', route: '/customer/policies' },
              { label: 'Buy Policy', icon: 'add_shopping_cart', route: '/customer/buy-policy' }
            ]
          },
          {
            title: 'Services', items: [
              { label: 'My Claims', icon: 'receipt_long', route: '/customer/claims', badge: 2 },
              { label: 'File a Claim', icon: 'note_add', route: '/customer/file-claim' },
              { label: 'Transactions', icon: 'account_balance_wallet', route: '/customer/transactions' },
              { label: 'AI Command Center', icon: 'psychology', route: '/customer/ai-command-center' },
              { label: 'AstraClaim AI ChatOps', icon: 'smart_toy', route: '/customer/astraclaim-chatops' }
            ]
          }
        ];
      case 'AGENT':
        return [
          {
            title: 'Overview', items: [
              { label: 'Dashboard', icon: 'dashboard', route: '/agent/dashboard' }
            ]
          },
          {
            title: 'Manage', items: [
              { label: 'My Customers', icon: 'groups', route: '/agent/customers' },
              { label: 'Policies Sold', icon: 'verified_user', route: '/agent/policies' },
              { label: 'AI Command Center', icon: 'psychology', route: '/agent/ai-command-center' },
              { label: 'AstraClaim AI ChatOps', icon: 'smart_toy', route: '/agent/astraclaim-chatops' }
            ]
          }
        ];
      case 'ADMIN':
        return [
          {
            title: 'Overview', items: [
              { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' }
            ]
          },
          {
            title: 'Management', items: [
              { label: 'All Policies', icon: 'verified_user', route: '/admin/policies' },
              { label: 'Claims Review', icon: 'gavel', route: '/admin/claims', badge: 2 },
              { label: 'Agents', icon: 'support_agent', route: '/admin/agents' },
              { label: 'Transactions', icon: 'account_balance_wallet', route: '/admin/transactions' },
              { label: 'AI Command Center', icon: 'psychology', route: '/admin/ai-command-center' },
              { label: 'AstraClaim AI ChatOps', icon: 'smart_toy', route: '/admin/astraclaim-chatops' }
            ]
          }
        ];
      default:
        return [];
    }
  });

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = e.urlAfterRedirects as string;
      const segments = url.split('/');
      const last = segments[segments.length - 1];
      const titles: Record<string, string> = {
        'dashboard': 'Dashboard',
        'policies': this.authService.userRole() === 'ADMIN' ? 'All Policies' : 'My Policies',
        'buy-policy': 'Buy Insurance',
        'claims': this.authService.userRole() === 'ADMIN' ? 'Claims Review' : 'My Claims',
        'file-claim': 'File a Claim',
        'transactions': 'Transactions',
        'customers': 'My Customers',
        'agents': 'Agent Management',
        'ai-command-center': 'AI Command Center',
        'astraclaim-chatops': 'AstraClaim AI ChatOps'
      };
      this.pageTitle.set(titles[last] || 'Dashboard');
    });
  }

  getInitials(): string {
    const name = this.authService.user()?.fullName || '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getFirstName(): string {
    const name = this.authService.user()?.fullName;
    return name ? name.split(' ')[0] : '';
  }

  getRoleDisplay(): string {
    const user = this.authService.user();
    if (!user) return '';
    const code = user.agentCode;
    return code ? `${user.role} • ${code}` : (user.role || '');
  }

  logout() {
    this.authService.logout();
  }
}
