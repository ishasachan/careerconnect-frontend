import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  applicantsCount: number;
  description?: string;
}

@Component({
  selector: 'app-find-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-jobs.component.html',
  styleUrl: './find-jobs.component.css'
})
export class FindJobsComponent {
  searchKeyword = '';
  selectedJobType = '';
  selectedLocation = '';
  
  allJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'TechCorp',
      location: 'Remote',
      salary: '$120k - $150k',
      type: 'FULL-TIME',
      postedDate: '2023-11-01',
      applicantsCount: 12
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'DesignFlow',
      location: 'New York, NY',
      salary: '$100k - $130k',
      type: 'FULL-TIME',
      postedDate: '2023-11-05',
      applicantsCount: 8
    },
    {
      id: '3',
      title: 'Backend Developer (Node.js)',
      company: 'ServerSide',
      location: 'Berlin, DE',
      salary: '€80 - €100 / hr',
      type: 'CONTRACT',
      postedDate: '2023-11-10',
      applicantsCount: 4
    },
    {
      id: '4',
      title: 'Full Stack Developer',
      company: 'StartupHub',
      location: 'San Francisco, CA',
      salary: '$130k - $160k',
      type: 'FULL-TIME',
      postedDate: '2023-11-08',
      applicantsCount: 15
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'CloudNative',
      location: 'Remote',
      salary: '$110k - $140k',
      type: 'FULL-TIME',
      postedDate: '2023-11-12',
      applicantsCount: 6
    },
    {
      id: '6',
      title: 'UX Researcher',
      company: 'UserFirst',
      location: 'Austin, TX',
      salary: '$90k - $120k',
      type: 'FULL-TIME',
      postedDate: '2023-11-09',
      applicantsCount: 10
    }
  ];

  jobTypes = ['All Types', 'FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  locations = ['All Locations', 'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Berlin, DE'];

  get jobs(): Job[] {
    return this.allJobs.filter(job => {
      const matchesKeyword = !this.searchKeyword || 
        job.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        job.location.toLowerCase().includes(this.searchKeyword.toLowerCase());
      
      const matchesType = !this.selectedJobType || 
        this.selectedJobType === 'All Types' || 
        job.type === this.selectedJobType;
      
      const matchesLocation = !this.selectedLocation || 
        this.selectedLocation === 'All Locations' || 
        job.location === this.selectedLocation;
      
      return matchesKeyword && matchesType && matchesLocation;
    });
  }

  selectedJob: Job | null = null;

  constructor(private router: Router) {}

  viewJobDetails(job: Job) {
    this.router.navigate(['/dashboard/seeker/find-jobs', job.id]);
  }

  clearFilters() {
    this.searchKeyword = '';
    this.selectedJobType = '';
    this.selectedLocation = '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
