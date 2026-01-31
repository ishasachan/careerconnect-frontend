import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../shared/services/job.service';
import { Job } from '../../../../shared/models/job.model';

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

  jobTypes = ['All Types', 'FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  locations = ['All Locations', 'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Berlin, DE'];

  selectedJob: Job | null = null;

  constructor(
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.searchJobs();
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
