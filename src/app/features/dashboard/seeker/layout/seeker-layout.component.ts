import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent, NavItem } from '../../../../shared/components/sidebar/sidebar.component';
import { NavbarComponent, NavbarUser } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-seeker-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './seeker-layout.component.html',
  styleUrl: './seeker-layout.component.css'
})
export class SeekerLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fas fa-th-large', route: '/dashboard/seeker', exact: true },
    { label: 'My Profile', icon: 'fas fa-user', route: '/dashboard/seeker/profile' },
    { label: 'Find Jobs', icon: 'fas fa-search', route: '/dashboard/seeker/find-jobs' },
    { label: 'Applications', icon: 'fas fa-briefcase', route: '/dashboard/seeker/applications' },
    { label: 'AI Coach', icon: 'fas fa-bolt', route: '/dashboard/seeker/ai-coach' }
  ];

  user: NavbarUser = {
    name: 'John Doe',
    role: 'Job Seeker'
  };

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
