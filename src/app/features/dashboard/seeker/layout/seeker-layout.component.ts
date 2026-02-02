import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  SidebarComponent,
  NavItem,
} from '../../../../shared/components/sidebar/sidebar.component';
import {
  NavbarComponent,
  NavbarUser,
} from '../../../../shared/components/navbar/navbar.component';
import { ProfileService } from '../../../../shared/services/profile.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-seeker-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './seeker-layout.component.html',
  styleUrl: './seeker-layout.component.css',
})
export class SeekerLayoutComponent implements OnInit {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-th-large',
      route: '/dashboard/seeker',
      exact: true,
    },
    {
      label: 'My Profile',
      icon: 'fas fa-user',
      route: '/dashboard/seeker/profile',
    },
    {
      label: 'Find Jobs',
      icon: 'fas fa-search',
      route: '/dashboard/seeker/find-jobs',
    },
    {
      label: 'Applications',
      icon: 'fas fa-briefcase',
      route: '/dashboard/seeker/applications',
    },
    {
      label: 'Saved Jobs',
      icon: 'fas fa-bookmark',
      route: '/dashboard/seeker/saved-jobs',
    },
  ];

  user: NavbarUser = {
    name: 'John Doe',
    role: 'Job Seeker',
  };

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileService.getProfile(currentUser.id).subscribe({
        next: (response: any) => {
          const profile = response.data || response;
          this.user = {
            name: profile.user?.name || 'User',
            role: 'Job Seeker',
            avatar: profile.avatarUrl || undefined,
          };
        },
        error: (error: any) => {
          console.error('Error loading profile:', error);
          this.user = {
            name: 'User',
            role: 'Job Seeker',
          };
        },
      });
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
