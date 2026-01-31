import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { ProfileService } from '../../../../shared/services/profile.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  isBookmarked = false;
  isLoading = true;
  errorMessage = '';
  showApplicationForm = false;
  isSubmittingApplication = false;

  // Application form data
  applicationForm = {
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    yearsOfExperience: '',
    currentCompany: '',
    resumeUrl: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private profileService: ProfileService,
    private authService: AuthService
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
          this.job = response.data;
          this.checkIfBookmarked();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching job details:', error);
        this.errorMessage = 'Failed to load job details. Please try again.';
      }
    });
  }

  checkIfBookmarked() {
    if (!this.job) return;
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      const savedJobs: Job[] = JSON.parse(saved);
      this.isBookmarked = savedJobs.some(j => j.id === this.job!.id);
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
      savedJobs = savedJobs.filter(j => j.id !== this.job!.id);
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
        }
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
      resumeUrl: ''
    };
  }

  submitApplication() {
    if (!this.job) return;

    // Validate required fields
    if (!this.applicationForm.fullName || !this.applicationForm.email || !this.applicationForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmittingApplication = true;

    // Create application object
    const application = {
      id: Date.now().toString(),
      jobId: this.job.id,
      jobTitle: this.job.title,
      company: this.job.company,
      location: this.job.location,
      salary: this.job.salary,
      appliedDate: new Date(),
      status: 'APPLIED' as const,
      fullName: this.applicationForm.fullName,
      email: this.applicationForm.email,
      phone: this.applicationForm.phone,
      coverLetter: this.applicationForm.coverLetter,
      yearsOfExperience: this.applicationForm.yearsOfExperience,
      currentCompany: this.applicationForm.currentCompany,
      resumeUrl: this.applicationForm.resumeUrl
    };

    // Save to localStorage
    const existingApplications = localStorage.getItem('applications');
    let applications = existingApplications ? JSON.parse(existingApplications) : [];
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Simulate API call
    setTimeout(() => {
      this.isSubmittingApplication = false;
      alert('Application submitted successfully!');
      this.closeApplicationForm();
    }, 1500);
  }

  checkCompatibility() {
    console.log('Checking compatibility for job:', this.job?.title);
    alert('Compatibility check initiated!');
  }

  getRequirementsArray(): string[] {
    if (!this.job?.requirements) return [];
    return this.job.requirements.split(',').filter(r => r.trim()).map(r => r.trim());
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
