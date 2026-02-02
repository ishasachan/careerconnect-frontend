import { Component } from '@angular/core';
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

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './recruiter-layout.component.html',
  styleUrl: './recruiter-layout.component.css',
})
export class RecruiterLayoutComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-th-large',
      route: '/dashboard/recruiter',
      exact: true,
    },
    {
      label: 'My Profile',
      icon: 'fas fa-user',
      route: '/dashboard/recruiter/profile',
    },
    {
      label: 'My Listings',
      icon: 'fas fa-briefcase',
      route: '/dashboard/recruiter/listings',
    },
    {
      label: 'Manage Applicants',
      icon: 'fas fa-users',
      route: '/dashboard/recruiter/applicants',
    },
  ];

  user: NavbarUser = {
    name: 'Sarah Smith',
    role: 'Recruiter',
  };

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
