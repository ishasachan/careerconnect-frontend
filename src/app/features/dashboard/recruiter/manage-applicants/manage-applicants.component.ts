import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-applicants.component.html',
  styleUrl: './manage-applicants.component.css'
})
export class ManageApplicantsComponent {
  selectedJobFilter = 'all';
  
  jobPostings = [
    { id: 1, title: 'Senior Frontend Engineer' },
    { id: 2, title: 'Product Designer' },
    { id: 3, title: 'Backend Developer (Node.js)' }
  ];

  applicants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'SHORTLISTED',
      jobId: 1,
      jobTitle: 'Senior Frontend Engineer',
      appliedDate: new Date('2023-11-02'),
      experience: '8 years',
      location: 'San Francisco, CA',
      resumeUrl: '#'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'UNDER REVIEW',
      jobId: 1,
      jobTitle: 'Senior Frontend Engineer',
      appliedDate: new Date('2024-01-15'),
      experience: '5 years',
      location: 'Remote',
      resumeUrl: '#'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'mchen@example.com',
      status: 'NEW',
      jobId: 2,
      jobTitle: 'Product Designer',
      appliedDate: new Date('2024-01-20'),
      experience: '6 years',
      location: 'New York, NY',
      resumeUrl: '#'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      status: 'INTERVIEWED',
      jobId: 1,
      jobTitle: 'Senior Frontend Engineer',
      appliedDate: new Date('2024-01-10'),
      experience: '7 years',
      location: 'Austin, TX',
      resumeUrl: '#'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'dwilson@example.com',
      status: 'REJECTED',
      jobId: 3,
      jobTitle: 'Backend Developer (Node.js)',
      appliedDate: new Date('2024-01-12'),
      experience: '3 years',
      location: 'Seattle, WA',
      resumeUrl: '#'
    }
  ];

  constructor(private route: ActivatedRoute) {
    // Check if there's a jobId query param to filter by
    this.route.queryParams.subscribe(params => {
      if (params['jobId']) {
        this.selectedJobFilter = params['jobId'];
      }
    });
  }

  get filteredApplicants() {
    if (this.selectedJobFilter === 'all') {
      return this.applicants;
    }
    return this.applicants.filter(a => a.jobId === parseInt(this.selectedJobFilter));
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'SHORTLISTED': 'bg-blue-100 text-blue-700',
      'UNDER REVIEW': 'bg-yellow-100 text-yellow-700',
      'NEW': 'bg-green-100 text-green-700',
      'INTERVIEWED': 'bg-purple-100 text-purple-700',
      'REJECTED': 'bg-red-100 text-red-700',
      'HIRED': 'bg-emerald-100 text-emerald-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  }

  viewResume(applicant: any): void {
    console.log('Viewing resume for:', applicant.name);
    window.open(applicant.resumeUrl, '_blank');
  }

  resetStatus(applicant: any): void {
    console.log('Resetting status for:', applicant.name);
    applicant.status = 'NEW';
  }

  updateStatus(applicant: any, newStatus: string): void {
    applicant.status = newStatus;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get newApplicantsCount(): number {
    return this.applicants.filter(a => a.status === 'NEW').length;
  }

  get shortlistedCount(): number {
    return this.applicants.filter(a => a.status === 'SHORTLISTED').length;
  }

  get interviewedCount(): number {
    return this.applicants.filter(a => a.status === 'INTERVIEWED').length;
  }

  get hiredCount(): number {
    return this.applicants.filter(a => a.status === 'HIRED').length;
  }
}
