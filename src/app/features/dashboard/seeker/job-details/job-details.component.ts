import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { ProfileService } from '../../../../shared/services/profile.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ApplicationService } from '../../../../shared/services/application.service';
import { MatchService } from '../../../../shared/services/match.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css',
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  isBookmarked = false;
  isLoading = true;
  errorMessage = '';
  showApplicationForm = false;
  isSubmittingApplication = false;
  isCheckingMatch = false;
  matchResult: any = null;
  showMatchResult = false;

  // Application form data
  applicationForm = {
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    yearsOfExperience: '',
    currentCompany: '',
    resumeUrl: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private profileService: ProfileService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private matchService: MatchService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(+jobId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid job ID';
    }
  }

  loadJobDetails(jobId: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobService.getJobById(jobId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          // Check if job is ACTIVE
          if (response.data.status !== 'ACTIVE') {
            this.errorMessage = 'This job is no longer available.';
            this.job = null;
            return;
          }
          this.job = response.data;
          this.checkIfBookmarked();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching job details:', error);
        this.errorMessage = 'Failed to load job details. Please try again.';
      },
    });
  }

  checkIfBookmarked() {
    if (!this.job) return;
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      const savedJobs: Job[] = JSON.parse(saved);
      this.isBookmarked = savedJobs.some((j) => j.id === this.job!.id);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/seeker/find-jobs']);
  }

  toggleBookmark() {
    if (!this.job) return;

    const saved = localStorage.getItem('savedJobs');
    let savedJobs: Job[] = saved ? JSON.parse(saved) : [];

    if (this.isBookmarked) {
      // Remove from saved jobs
      savedJobs = savedJobs.filter((j) => j.id !== this.job!.id);
      this.isBookmarked = false;
    } else {
      // Add to saved jobs
      savedJobs.push(this.job);
      this.isBookmarked = true;
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }

  applyNow() {
    this.showApplicationForm = true;
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileService.getProfile(currentUser.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Auto-fill form from profile
            this.applicationForm.fullName = response.data.user.name || '';
            this.applicationForm.email = response.data.user.email || '';
            this.applicationForm.resumeUrl = response.data.resumeUrl || '';
          }
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
    }
  }

  closeApplicationForm() {
    this.showApplicationForm = false;
    this.resetApplicationForm();
  }

  resetApplicationForm() {
    this.applicationForm = {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      yearsOfExperience: '',
      currentCompany: '',
      resumeUrl: '',
    };
  }

  submitApplication() {
    if (!this.job) return;

    // Validate required fields
    if (
      !this.applicationForm.fullName ||
      !this.applicationForm.email ||
      !this.applicationForm.phone
    ) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.warning('Please login to apply');
      return;
    }

    this.isSubmittingApplication = true;

    // Create application request
    const applicationRequest = {
      userId: currentUser.id,
      jobId: this.job.id,
      fullName: this.applicationForm.fullName,
      email: this.applicationForm.email,
      phone: this.applicationForm.phone,
      yearsOfExperience: this.applicationForm.yearsOfExperience
        ? parseInt(this.applicationForm.yearsOfExperience)
        : 0,
      currentCompany: this.applicationForm.currentCompany || '',
      resumeUrl: this.applicationForm.resumeUrl || '',
      coverLetter: this.applicationForm.coverLetter || '',
    };

    this.applicationService.submitApplication(applicationRequest).subscribe({
      next: (response) => {
        this.isSubmittingApplication = false;
        if (response.success) {
          this.toastService.success('Application submitted successfully!');
          this.closeApplicationForm();
        } else {
          // Handle error case (e.g., already applied)
          this.toastService.error(
            response.message || 'Failed to submit application',
          );
          this.closeApplicationForm();
        }
      },
      error: (error) => {
        this.isSubmittingApplication = false;
        console.error('Error submitting application:', error);
        const errorMsg =
          error.error?.message ||
          'Failed to submit application. Please try again.';
        this.toastService.error(errorMsg);
        this.closeApplicationForm();
      },
    });
  }

  checkCompatibility() {
    if (!this.job) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.warning('Please login to check compatibility');
      return;
    }

    this.isCheckingMatch = true;
    this.showMatchResult = false;

    this.matchService
      .checkCompatibility(currentUser.id, this.job.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.matchResult = response.data;
            this.showMatchResult = true;
          } else {
            this.toastService.error(
              response.message || 'Failed to check compatibility',
            );
          }
          this.isCheckingMatch = false;
        },
        error: (error) => {
          console.error('Error checking compatibility:', error);
          this.toastService.error(
            'Failed to check compatibility. Please try again.',
          );
          this.isCheckingMatch = false;
        },
      });
  }

  getMatchColor(score: number): string {
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    if (score >= 25) return 'orange';
    return 'red';
  }

  getMatchLabel(score: number): string {
    if (score >= 75) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    if (score >= 25) return 'Fair Match';
    return 'Low Match';
  }

  closeMatchResult() {
    this.showMatchResult = false;
  }

  getRequirementsArray(): string[] {
    if (!this.job?.requirements) return [];
    return this.job.requirements
      .split(',')
      .filter((r) => r.trim())
      .map((r) => r.trim());
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
}
