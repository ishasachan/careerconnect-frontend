import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  applicantsCount: number;
  description: string;
  requirements: string[];
  department: string;
  logo?: string;
}

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

  // Sample job data - in real app, this would come from a service
  jobs: { [key: string]: Job } = {
    '1': {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'TechFlow',
      location: 'San Francisco, CA',
      salary: '$150k - $200k',
      type: 'FULL-TIME',
      postedDate: '2023-10-25',
      applicantsCount: 12,
      description: 'We are looking for a React expert to lead our dashboard redesign and help build the next generation of our platform. You will work with a talented team of designers and engineers.',
      requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      department: 'Engineering'
    },
    '2': {
      id: '2',
      title: 'Product Designer',
      company: 'DesignFlow',
      location: 'New York, NY',
      salary: '$100k - $130k',
      type: 'FULL-TIME',
      postedDate: '2023-11-05',
      applicantsCount: 8,
      description: 'Join our design team to create beautiful and intuitive user experiences. Work on exciting projects across web and mobile platforms.',
      requirements: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
      department: 'Design'
    },
    '3': {
      id: '3',
      title: 'Backend Developer (Node.js)',
      company: 'ServerSide',
      location: 'Berlin, DE',
      salary: '€80 - €100 / hr',
      type: 'CONTRACT',
      postedDate: '2023-11-10',
      applicantsCount: 4,
      description: 'We need an experienced backend developer to help scale our API infrastructure and improve system reliability.',
      requirements: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      department: 'Engineering'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId && this.jobs[jobId]) {
      this.job = this.jobs[jobId];
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/seeker/find-jobs']);
  }

  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
  }

  applyNow() {
    console.log('Applying to job:', this.job?.title);
    alert('Application submitted successfully!');
  }

  checkCompatibility() {
    console.log('Checking compatibility for job:', this.job?.title);
    alert('Compatibility check initiated!');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
