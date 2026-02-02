import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Job } from '../../../shared/models/job.model';
import { Application } from '../../../shared/models/application.model';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrl: './recruiter-dashboard.component.css',
})
export class RecruiterDashboardComponent implements OnInit {
  jobs: Job[] = [];
  allApplications: Application[] = [];
  isLoading = true;
  showProfileAlert = false;
  profileCompletionPercentage = 0;
  recentApplications: Application[] = [];
  topPerformingJobs: Job[] = [];

  // Chart data
  applicationVolumeData: any[] = [];

  // Chart options
  view: [number, number] | undefined = undefined;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Job Positions';
  showYAxisLabel = true;
  showGridLines = true;
  yAxisLabel = 'Applications';
  roundDomains = true;
  colorScheme: any = {
    domain: ['#6366F1', '#818CF8', '#A78BFA', '#C4B5FD', '#DDD6FE'],
  };

  constructor(
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.checkProfileCompletion();
  }

  loadDashboardData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // Load jobs
    this.jobService.getRecruiterJobs(currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.jobs = response.data;
          this.topPerformingJobs = [...this.jobs]
            .sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0))
            .slice(0, 5);
          this.updateChartData();
        }
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.checkLoadingComplete();
      },
    });

    // Load applications
    this.applicationService.getRecruiterApplicants(currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.allApplications = response.data;
          this.recentApplications = [...this.allApplications]
            .sort(
              (a, b) =>
                new Date(b.appliedDate).getTime() -
                new Date(a.appliedDate).getTime(),
            )
            .slice(0, 5);
        }
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.checkLoadingComplete();
      },
    });
  }

  checkLoadingComplete() {
    // Simple check - in real app you'd use forkJoin
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  checkProfileCompletion() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.profileService.getProfile(currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const profile = response.data;
          let completedFields = 0;
          const totalFields = 4;

          if (profile.bio) completedFields++;
          if (profile.skills) completedFields++;
          if (profile.resumeUrl) completedFields++;
          if (profile.avatarUrl) completedFields++;

          this.profileCompletionPercentage = Math.round(
            (completedFields / totalFields) * 100,
          );
          this.showProfileAlert = this.profileCompletionPercentage < 75;
        }
      },
      error: (error) => {
        console.error('Error checking profile:', error);
        this.showProfileAlert = true;
        this.profileCompletionPercentage = 0;
      },
    });
  }

  updateChartData() {
    // If we have jobs data, use applicantsCount from jobs
    if (this.jobs.length > 0) {
      this.applicationVolumeData = this.jobs
        .filter((job) => (job.applicantsCount || 0) > 0)
        .map((job) => ({
          name:
            job.title.length > 20
              ? job.title.substring(0, 20) + '...'
              : job.title,
          value: job.applicantsCount || 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);
    } else if (this.allApplications.length > 0) {
      // Fallback: Group applications by job
      const jobApplicationCounts: { [key: string]: number } = {};

      this.allApplications.forEach((app) => {
        const jobTitle =
          app.job.title.length > 20
            ? app.job.title.substring(0, 20) + '...'
            : app.job.title;
        jobApplicationCounts[jobTitle] =
          (jobApplicationCounts[jobTitle] || 0) + 1;
      });

      this.applicationVolumeData = Object.entries(jobApplicationCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);
    }
  }

  completeProfile() {
    this.router.navigate(['/dashboard/recruiter/profile']);
  }

  dismissProfileAlert() {
    this.showProfileAlert = false;
  }

  viewAllListings() {
    this.router.navigate(['/dashboard/recruiter/listings']);
  }

  viewJob(jobId: number) {
    this.router.navigate(['/dashboard/recruiter/applicants'], {
      queryParams: { jobId },
    });
  }

  viewAllApplicants() {
    this.router.navigate(['/dashboard/recruiter/applicants']);
  }

  viewApplicant(applicationId: number) {
    this.router.navigate(['/dashboard/recruiter/applicants']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      APPLIED: 'bg-blue-100 text-blue-700',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
      SHORTLISTED: 'bg-purple-100 text-purple-700',
      INTERVIEW: 'bg-indigo-100 text-indigo-700',
      HIRED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }

  get activeJobsCount(): number {
    return this.jobs.filter((j) => j.status === 'ACTIVE').length;
  }

  get totalApplicants(): number {
    return this.allApplications.length;
  }

  get hiredCount(): number {
    return this.allApplications.filter((app) => app.status === 'HIRED').length;
  }

  get interviewingCount(): number {
    return this.allApplications.filter((app) => app.status === 'INTERVIEW')
      .length;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
