import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Application } from '../../../../shared/models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const saved = localStorage.getItem('applications');
    if (saved) {
      this.applications = JSON.parse(saved);
      // Convert date strings back to Date objects
      this.applications = this.applications.map(app => ({
        ...app,
        appliedDate: new Date(app.appliedDate)
      }));
    }
  }

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
