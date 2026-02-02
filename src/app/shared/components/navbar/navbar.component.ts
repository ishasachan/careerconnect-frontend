import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavbarUser {
  name: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() user!: NavbarUser;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() hasNotification: boolean = false;

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
