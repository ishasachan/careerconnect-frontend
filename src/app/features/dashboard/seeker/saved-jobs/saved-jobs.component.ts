import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Job } from '../../../../shared/models/job.model';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css',
})
export class SavedJobsComponent implements OnInit {
  savedJobs: Job[] = [];
  isLoading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadSavedJobs();
  }

  loadSavedJobs() {
    // Load from localStorage
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      this.savedJobs = JSON.parse(saved);
    }
    this.isLoading = false;
  }

  removeSavedJob(jobId: number) {
    this.savedJobs = this.savedJobs.filter((job) => job.id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(this.savedJobs));
  }

  viewJobDetails(job: Job) {
    this.router.navigate(['/dashboard/seeker/find-jobs', job.id]);
  }

  navigateToJobs() {
    this.router.navigate(['/dashboard/seeker/find-jobs']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
