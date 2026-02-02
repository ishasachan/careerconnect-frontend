import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { RecommendationService } from '../../../../shared/services/recommendation.service';
import { Recommendation } from '../../../../shared/models/recommendation.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { ProfileService } from '../../../../shared/services/profile.service';

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
  isProfileComplete = false;
  isLoadingRecommendations = true;

  jobTypes = ['All Types', 'FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  locations: string[] = ['All Locations'];

  selectedJob: Job | null = null;

  constructor(
    private router: Router,
    private jobService: JobService,
    private recommendationService: RecommendationService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadAvailableLocations();
    this.searchJobs();
    this.checkProfileAndLoadRecommendations();
  }

  loadAvailableLocations() {
    // Fetch all jobs to extract unique locations
    this.jobService.getJobs({}).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Extract unique locations from ACTIVE jobs only
          const activeJobs = response.data.filter(job => job.status === 'ACTIVE');
          const uniqueLocations = [...new Set(activeJobs.map(job => job.location))]
            .filter(loc => loc && loc.trim() !== '')
            .sort();
          
          this.locations = ['All Locations', ...uniqueLocations];
        }
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        // Keep default 'All Locations' if error
      }
    });
  }

  checkProfileAndLoadRecommendations() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoadingRecommendations = false;
      return;
    }

    // First check if profile exists and is complete
    this.profileService.getProfile(currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const profile = response.data;
          // Check if profile has essential fields
          this.isProfileComplete = !!(profile.bio && profile.skills && profile.resumeUrl);
          
          if (this.isProfileComplete) {
            // Profile is complete, load recommendations
            this.loadRecommendations();
          } else {
            this.isLoadingRecommendations = false;
          }
        } else {
          this.isProfileComplete = false;
          this.isLoadingRecommendations = false;
        }
      },
      error: (error) => {
        console.error('Error checking profile:', error);
        this.isProfileComplete = false;
        this.isLoadingRecommendations = false;
      }
    });
  }

  loadRecommendations() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.recommendationService.getUserRecommendations(currentUser.id).subscribe({
        next: (response) => {
          this.isLoadingRecommendations = false;
          if (response.success && response.data) {
            this.recommendations = response.data.slice(0, 3); // Get top 3
          } else {
            console.log('No recommendations available:', response.message);
            this.recommendations = [];
          }
        },
        error: (error) => {
          console.error('Error loading recommendations:', error);
          this.isLoadingRecommendations = false;
          this.recommendations = [];
        }
      });
    } else {
      this.isLoadingRecommendations = false;
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
          // Filter to show only ACTIVE jobs (exclude PAUSED, CLOSED, and deleted jobs)
          this.jobs = response.data.filter(job => job.status === 'ACTIVE');
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
