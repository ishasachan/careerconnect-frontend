import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Application } from '../../../../shared/models/application.model';
import { ApplicationService } from '../../../../shared/services/application.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      this.errorMessage = 'Please login to view applications';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.applicationService.getUserApplications(currentUser.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.applications = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading applications:', error);
        this.errorMessage = 'Failed to load applications. Please try again.';
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'APPLIED': 'bg-blue-100 text-blue-700',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-700',
      'SHORTLISTED': 'bg-purple-100 text-purple-700',
      'INTERVIEW': 'bg-indigo-100 text-indigo-700',
      'HIRED': 'bg-green-100 text-green-700',
      'REJECTED': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/dashboard/seeker/find-jobs', jobId]);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(new Date(date));
  }

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }
}
