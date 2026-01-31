import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  isBookmarked = false;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
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
    console.log('Applying to job:', this.job?.title);
    alert('Application submitted successfully!');
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
