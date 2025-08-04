import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UpperCasePipe, NgIf, isPlatformBrowser } from '@angular/common';

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  [key: string]: any; // For any additional user properties
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, UpperCasePipe, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isAdmin = false;
  private isBrowser: boolean;
  private destroyed = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadUser();
      // Use NgZone to ensure proper change detection
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('storage', this.storageEventListener);
      });
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.isBrowser) {
      window.removeEventListener('storage', this.storageEventListener);
    }
  }

  // Use arrow function to maintain 'this' context
  private storageEventListener = (event: StorageEvent) => {
    if (event.key === 'user') {
      this.ngZone.run(() => {
        this.loadUser();
      });
    }
  };

  private loadUser() {
    if (this.destroyed) return;
    if (this.isBrowser) {
      try {
        const userData = localStorage.getItem('user');
        this.user = userData ? JSON.parse(userData) : null;
        this.isAdmin = this.user?.role === 'admin';
      } catch (error) {
        console.error('Error loading user:', error);
        this.user = null;
      }
    }
  }

  logout() {
    try {
      localStorage.removeItem('user');
      this.user = null;
      // Navigate to home after logout
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  get userInitial(): string {
    return this.user?.username ? this.user.username[0].toUpperCase() : '';
  }
}
