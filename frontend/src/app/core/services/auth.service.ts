import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, LoginRequest } from '../models/models';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  user = this.currentUser.asReadonly();
  loggedIn = this.isAuthenticated.asReadonly();
  userRole = computed(() => this.currentUser()?.role || null);

  // Demo credentials
  readonly demoCredentials = [
    { email: 'rajesh@email.com', password: 'customer123', role: 'CUSTOMER' as UserRole, name: 'Rajesh Kumar Sharma' },
    { email: 'agent@email.com', password: 'agent123', role: 'AGENT' as UserRole, name: 'Suresh Nair' },
    { email: 'admin@email.com', password: 'admin123', role: 'ADMIN' as UserRole, name: 'Admin PragyaShield' }
  ];

  constructor(private mockData: MockDataService, private router: Router) {
    this.loadFromStorage();
  }

  login(request: LoginRequest): { success: boolean; message: string } {
    const cred = this.demoCredentials.find(c => c.email === request.email && c.role === request.role);
    if (!cred) {
      return { success: false, message: 'Invalid email or role. Please use the demo credentials shown below.' };
    }
    if (request.password !== cred.password) {
      return { success: false, message: 'Invalid password. Please check the demo credentials.' };
    }
    const user = this.mockData.getUserByEmail(request.email);
    if (!user) {
      return { success: false, message: 'User not found in system.' };
    }
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('isAuthenticated', 'true');
    return { success: true, message: 'Login successful!' };
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  private loadFromStorage(): void {
    const userData = sessionStorage.getItem('currentUser');
    const authState = sessionStorage.getItem('isAuthenticated');
    if (userData && authState === 'true') {
      this.currentUser.set(JSON.parse(userData));
      this.isAuthenticated.set(true);
    }
  }

  getDashboardRoute(): string {
    const role = this.userRole();
    switch (role) {
      case 'CUSTOMER': return '/customer/dashboard';
      case 'AGENT': return '/agent/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/login';
    }
  }
}
