import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../shared/services/application.service';
import { JobService } from '../../../shared/services/job.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Application } from '../../../shared/models/application.model';
import { Job } from '../../../shared/models/job.model';

@Component({
  selector: 'app-seeker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seeker-dashboard.component.html',
  styleUrl: './seeker-dashboard.component.css'
})
export class SeekerDashboardComponent implements OnInit {
  applications: Application[] = [];
  recentJobs: Job[] = [];
  savedJobsCount = 0;
  isLoading = true;
  profileCompletionPercentage = 0;

  stats = {
    totalApplications: 0,
    shortlisted: 0,
    savedJobs: 0,
    profileCompletion: 0
  };

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // Load applications
    this.applicationService.getUserApplications(currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.applications = response.data;
          this.stats.totalApplications = this.applications.length;
          this.stats.shortlisted = this.applications.filter(app => app.status === 'SHORTLISTED').length;
        }
      },
      error: (error) => console.error('Error loading applications:', error)
    });

    // Load recent jobs
    this.jobService.getJobs({}).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentJobs = response.data.slice(0, 5);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
      }
    });

    // Load saved jobs count
    const savedJobs = localStorage.getItem('savedJobs');
    if (savedJobs) {
      this.savedJobsCount = JSON.parse(savedJobs).length;
      this.stats.savedJobs = this.savedJobsCount;
    }

    // Load profile completion
    this.profileService.getProfile(currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.calculateProfileCompletion(response.data);
        }
      },
      error: (error) => console.error('Error loading profile:', error)
    });
  }

  calculateProfileCompletion(profile: any) {
    let completed = 0;
    const fields = [
      profile.bio,
      profile.skills,
      profile.resumeUrl,
      profile.avatarUrl
    ];
    
    fields.forEach(field => {
      if (field && field.trim()) completed += 25;
    });

    this.profileCompletionPercentage = completed;
    this.stats.profileCompletion = completed;
  }

  getRecentApplications(): Application[] {
    return this.applications.slice(0, 3);
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'APPLIED': 'bg-gray-100 text-gray-700',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-700',
      'SHORTLISTED': 'bg-green-100 text-green-700',
      'INTERVIEW': 'bg-blue-100 text-blue-700',
      'REJECTED': 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  viewJob(jobId: number) {
    this.router.navigate(['/dashboard/seeker/find-jobs', jobId]);
  }
}
