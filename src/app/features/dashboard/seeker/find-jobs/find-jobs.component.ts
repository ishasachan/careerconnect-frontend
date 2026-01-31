import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { RecommendationService } from '../../../../shared/services/recommendation.service';
import { Recommendation } from '../../../../shared/models/recommendation.model';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-find-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-jobs.component.html',
  styleUrl: './find-jobs.component.css'
})
export class FindJobsComponent implements OnInit {
  searchKeyword = '';
  selectedJobType = '';
  selectedLocation = '';
  isLoading = false;
  errorMessage = '';
  
  jobs: Job[] = [];
  recommendations: Recommendation[] = [];

  jobTypes = ['All Types', 'FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  locations = ['All Locations', 'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Berlin, DE'];

  selectedJob: Job | null = null;

  constructor(
    private router: Router,
    private jobService: JobService,
    private recommendationService: RecommendationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.searchJobs();
    this.loadRecommendations();
  }

  loadRecommendations() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.recommendationService.getUserRecommendations(currentUser.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.recommendations = response.data.slice(0, 3); // Get top 3
          } else {
            // Profile not found or no recommendations
            console.log('No recommendations available:', response.message);
            this.recommendations = [];
          }
        },
        error: (error) => {
          console.error('Error loading recommendations:', error);
          this.recommendations = [];
        }
      });
    }
  }

  searchJobs() {
    this.isLoading = true;
    this.errorMessage = '';

    const searchParams = {
      keyword: this.searchKeyword || undefined,
      type: this.selectedJobType && this.selectedJobType !== 'All Types' ? this.selectedJobType : undefined,
      location: this.selectedLocation && this.selectedLocation !== 'All Locations' ? this.selectedLocation : undefined
    };

    this.jobService.getJobs(searchParams).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.jobs = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching jobs:', error);
        this.errorMessage = 'Failed to load jobs. Please try again.';
      }
    });
  }

  viewJobDetails(job: Job) {
    this.router.navigate(['/dashboard/seeker/find-jobs', job.id]);
  }
  viewRecommendedJob(jobId: number) {
    this.router.navigate(['/dashboard/seeker/job-details', jobId]);
  }

  navigateToProfile() {
    this.router.navigate(['/dashboard/seeker/profile']);
  }

  clearFilters() {
    this.searchKeyword = '';
    this.selectedJobType = '';
    this.selectedLocation = '';
    this.searchJobs();
  }

  getRequirementsArray(requirements: string): string[] {
    return requirements.split(',').filter(r => r.trim()).map(r => r.trim());
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
