import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../../shared/services/application.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Application } from '../../../../shared/models/application.model';

@Component({
  selector: 'app-manage-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-applicants.component.html',
  styleUrl: './manage-applicants.component.css'
})
export class ManageApplicantsComponent implements OnInit {
  selectedJobFilter = 'all';
  applicants: Application[] = [];
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadApplicants();
    
    // Check if there's a jobId query param to filter by
    this.route.queryParams.subscribe(params => {
      if (params['jobId']) {
        this.selectedJobFilter = params['jobId'];
      }
    });
  }

  loadApplicants() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    console.log('Loading applicants for recruiter:', currentUser.id);

    this.applicationService.getRecruiterApplicants(currentUser.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Applicants loaded successfully:', response);
        
        if (response.success && response.data) {
          this.applicants = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load applicants';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading applicants:', error);
        this.errorMessage = 'Failed to load applicants. Please try again.';
      }
    });
  }

  get filteredApplicants() {
    if (this.selectedJobFilter === 'all') {
      return this.applicants;
    }
    return this.applicants.filter(a => a.job.id === parseInt(this.selectedJobFilter));
  }

  get uniqueJobs() {
    const jobMap = new Map();
    this.applicants.forEach(app => {
      if (!jobMap.has(app.job.id)) {
        jobMap.set(app.job.id, { id: app.job.id, title: app.job.title });
      }
    });
    return Array.from(jobMap.values());
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  }

  viewResume(applicant: Application): void {
    console.log('Viewing resume for:', applicant.fullName);
    window.open(applicant.resumeUrl, '_blank');
  }

  updateStatus(applicant: Application, newStatus: string): void {
    if (confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      this.applicationService.updateApplicationStatus(applicant.id, newStatus).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Status updated successfully:', response);
            applicant.status = newStatus as any;
          } else {
            alert('Failed to update status: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status. Please try again.');
        }
      });
    }
  }

  resetStatus(applicant: Application): void {
    if (confirm('Are you sure you want to reset the application status?')) {
      this.applicationService.resetApplicationStatus(applicant.id).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Status reset successfully:', response);
            applicant.status = response.data.status;
          } else {
            alert('Failed to reset status: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error resetting status:', error);
          alert('Failed to reset status. Please try again.');
        }
      });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get newApplicantsCount(): number {
    return this.applicants.filter(a => a.status === 'APPLIED').length;
  }

  get shortlistedCount(): number {
    return this.applicants.filter(a => a.status === 'SHORTLISTED').length;
  }

  get interviewedCount(): number {
    return this.applicants.filter(a => a.status === 'INTERVIEW').length;
  }

  get hiredCount(): number {
    return this.applicants.filter(a => a.status === 'HIRED').length;
  }
}
