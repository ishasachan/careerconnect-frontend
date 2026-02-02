import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { JobService } from '../../../../shared/services/job.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Job } from '../../../../shared/models/job.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-recruiter-listings',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './recruiter-listings.component.html',
  styleUrl: './recruiter-listings.component.css',
})
export class RecruiterListingsComponent implements OnInit {
  listings: Job[] = [];
  isLoading = false;
  errorMessage = '';
  openDropdownId: number | null = null;

  constructor(
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    console.log('Loading jobs for recruiter:', currentUser.id);

    this.jobService.getRecruiterJobs(currentUser.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Jobs loaded successfully:', response);

        if (response.success && response.data) {
          this.listings = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load jobs';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading jobs:', error);
        this.errorMessage = 'Failed to load jobs. Please try again.';
      },
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-700',
      CLOSED: 'bg-red-100 text-red-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      PAUSED: 'bg-yellow-100 text-yellow-700',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  viewApplicants(jobId: number): void {
    this.router.navigate(['/dashboard/recruiter/applicants'], {
      queryParams: { jobId },
    });
  }

  editJob(jobId: number): void {
    this.router.navigate(['/dashboard/recruiter/post-job'], {
      queryParams: { id: jobId },
    });
  }

  postNewJob(): void {
    this.router.navigate(['/dashboard/recruiter/post-job']);
  }

  toggleDropdown(jobId: number, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === jobId ? null : jobId;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  isDropdownOpen(jobId: number): boolean {
    return this.openDropdownId === jobId;
  }

  pauseJob(jobId: number): void {
    if (confirm('Are you sure you want to pause this job posting?')) {
      this.jobService.pauseJob(jobId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Job paused successfully:', response);
            this.toastService.success('Job paused successfully');
            // Reload jobs to get updated status
            this.loadJobs();
          } else {
            this.toastService.error('Failed to pause job: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error pausing job:', error);
          this.toastService.error('Failed to pause job. Please try again.');
        },
      });
    }
    this.closeDropdown();
  }

  resumeJob(jobId: number): void {
    if (confirm('Are you sure you want to resume this job posting?')) {
      this.jobService.resumeJob(jobId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Job resumed successfully:', response);
            this.toastService.success('Job resumed successfully');
            // Reload jobs to get updated status
            this.loadJobs();
          } else {
            this.toastService.error(
              'Failed to resume job: ' + response.message,
            );
          }
        },
        error: (error) => {
          console.error('Error resuming job:', error);
          this.toastService.error('Failed to resume job. Please try again.');
        },
      });
    }
    this.closeDropdown();
  }

  formatSalary(salary: string): string {
    if (!salary) return 'Not specified';

    // Map currency symbols to codes
    const currencyMap: { [key: string]: string } = {
      '₹': 'INR',
      $: 'USD',
      A$: 'AUD',
    };

    // Extract currency symbol
    let currencyCode = '';
    let salaryText = salary;

    for (const [symbol, code] of Object.entries(currencyMap)) {
      if (salary.startsWith(symbol)) {
        currencyCode = code;
        salaryText = salary.substring(symbol.length);
        break;
      }
    }

    // Format numbers (e.g., 50000 -> 50k, 1000000 -> 1M)
    const formatNumber = (num: string): string => {
      const n = parseFloat(num.replace(/[^0-9.]/g, ''));
      if (isNaN(n)) return num;

      if (n >= 1000000) {
        return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
      } else if (n >= 1000) {
        return (n / 1000).toFixed(0) + 'K';
      }
      return n.toString();
    };

    // Handle range (e.g., "50000-80000" or "50k-80k")
    if (salaryText.includes('-')) {
      const parts = salaryText.split('-');
      const formattedParts = parts.map((p) => formatNumber(p.trim()));
      return `${currencyCode} ${formattedParts.join('-')}`;
    }

    // Handle single value
    return `${currencyCode} ${formatNumber(salaryText)}`;
  }

  closeJob(jobId: number): void {
    if (
      confirm(
        'Are you sure you want to close this job posting? This will stop accepting new applicants.',
      )
    ) {
      this.jobService.closeJob(jobId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Job closed successfully:', response);
            this.toastService.success('Job closed successfully');
            // Reload jobs to get updated status
            this.loadJobs();
          } else {
            this.toastService.error('Failed to close job: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error closing job:', error);
          this.toastService.error('Failed to close job. Please try again.');
        },
      });
    }
    this.closeDropdown();
  }

  reopenJob(jobId: number): void {
    if (confirm('Are you sure you want to reopen this job posting?')) {
      this.jobService.reopenJob(jobId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Job reopened successfully:', response);
            this.toastService.success('Job reopened successfully');
            // Reload jobs to get updated status
            this.loadJobs();
          } else {
            this.toastService.error(
              'Failed to reopen job: ' + response.message,
            );
          }
        },
        error: (error) => {
          console.error('Error reopening job:', error);
          this.toastService.error('Failed to reopen job. Please try again.');
        },
      });
    }
    this.closeDropdown();
  }

  deleteJob(jobId: number): void {
    if (
      confirm(
        'Are you sure you want to delete this job posting? This action cannot be undone.',
      )
    ) {
      this.jobService.deleteJob(jobId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Job deleted successfully:', response);
            this.toastService.success('Job deleted successfully');
            // Remove from local list
            this.listings = this.listings.filter((l) => l.id !== jobId);
          } else {
            this.toastService.error(
              'Failed to delete job: ' + response.message,
            );
          }
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          this.toastService.error('Failed to delete job. Please try again.');
        },
      });
    }
    this.closeDropdown();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  get activeJobsCount(): number {
    return this.listings.filter((l) => l.status === 'ACTIVE').length;
  }

  get totalApplicants(): number {
    return this.listings.reduce((sum, l) => sum + (l.applicantsCount || 0), 0);
  }

  get avgApplicants(): string {
    if (this.listings.length === 0) return '0';
    return (this.totalApplicants / this.listings.length).toFixed(0);
  }
}
