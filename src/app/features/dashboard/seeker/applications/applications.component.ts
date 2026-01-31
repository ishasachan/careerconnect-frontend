import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent {
  applications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Engineer',
      company: 'TechCorp',
      appliedDate: new Date('2026-01-15'),
      status: 'SHORTLISTED',
      location: 'Remote',
      salary: '$120k - $160k'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'InnovateTech',
      appliedDate: new Date('2026-01-20'),
      status: 'UNDER REVIEW',
      location: 'San Francisco, CA',
      salary: '$110k - $150k'
    },
    {
      id: 3,
      jobTitle: 'React Developer',
      company: 'StartupXYZ',
      appliedDate: new Date('2026-01-10'),
      status: 'REJECTED',
      location: 'New York, NY',
      salary: '$100k - $130k'
    },
    {
      id: 4,
      jobTitle: 'UI/UX Engineer',
      company: 'DesignHub',
      appliedDate: new Date('2026-01-25'),
      status: 'APPLIED',
      location: 'Remote',
      salary: '$90k - $120k'
    }
  ];

  constructor(private router: Router) {}

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'SHORTLISTED': 'bg-blue-100 text-blue-700',
      'UNDER REVIEW': 'bg-yellow-100 text-yellow-700',
      'REJECTED': 'bg-red-100 text-red-700',
      'APPLIED': 'bg-gray-100 text-gray-700',
      'INTERVIEW': 'bg-purple-100 text-purple-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/dashboard/seeker/find-jobs', jobId]);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  }

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }
}
