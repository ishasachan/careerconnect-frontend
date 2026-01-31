import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-recruiter-listings',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './recruiter-listings.component.html',
  styleUrl: './recruiter-listings.component.css'
})
export class RecruiterListingsComponent {
  listings = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      location: 'Remote',
      status: 'ACTIVE',
      applicants: 12,
      postedDate: new Date('2026-01-15'),
      type: 'Full-time',
      salary: '$120k - $160k'
    },
    {
      id: 2,
      title: 'Product Designer',
      location: 'New York, NY',
      status: 'ACTIVE',
      applicants: 8,
      postedDate: new Date('2026-01-18'),
      type: 'Full-time',
      salary: '$90k - $130k'
    },
    {
      id: 3,
      title: 'Backend Developer (Node.js)',
      location: 'Berlin, DE',
      status: 'ACTIVE',
      applicants: 4,
      postedDate: new Date('2026-01-22'),
      type: 'Contract',
      salary: '$110k - $150k'
    }
  ];

  openDropdownId: number | null = null;

  constructor(private router: Router) {}

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'ACTIVE': 'bg-green-100 text-green-700',
      'CLOSED': 'bg-red-100 text-red-700',
      'DRAFT': 'bg-gray-100 text-gray-700',
      'PAUSED': 'bg-yellow-100 text-yellow-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  viewApplicants(jobId: number): void {
    this.router.navigate(['/dashboard/recruiter/applicants'], { queryParams: { jobId } });
  }

  editJob(jobId: number): void {
    this.router.navigate(['/dashboard/recruiter/post-job'], { queryParams: { id: jobId } });
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
    console.log('Pausing job:', jobId);
    this.closeDropdown();
  }

  closeJob(jobId: number): void {
    console.log('Closing job:', jobId);
    this.closeDropdown();
  }

  duplicateJob(jobId: number): void {
    console.log('Duplicating job:', jobId);
    this.closeDropdown();
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.listings = this.listings.filter(l => l.id !== jobId);
      console.log('Deleted job:', jobId);
    }
    this.closeDropdown();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  }

  get activeJobsCount(): number {
    return this.listings.filter(l => l.status === 'ACTIVE').length;
  }

  get totalApplicants(): number {
    return this.listings.reduce((sum, l) => sum + l.applicants, 0);
  }

  get avgApplicants(): string {
    if (this.listings.length === 0) return '0';
    return (this.totalApplicants / this.listings.length).toFixed(0);
  }
}
