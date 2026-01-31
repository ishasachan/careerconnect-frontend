import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.css'
})
export class PostJobComponent {
  job = {
    title: '',
    company: 'TechCorp',
    location: '',
    type: 'FULL-TIME',
    workMode: 'REMOTE',
    experienceLevel: 'MID',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    skills: [] as string[]
  };

  requirementInput = '';
  responsibilityInput = '';
  benefitInput = '';
  skillInput = '';

  jobTypes = ['FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  workModes = ['REMOTE', 'ON-SITE', 'HYBRID'];
  experienceLevels = [
    { value: 'ENTRY', label: 'Entry Level (0-2 years)' },
    { value: 'MID', label: 'Mid Level (2-5 years)' },
    { value: 'SENIOR', label: 'Senior (5+ years)' },
    { value: 'LEAD', label: 'Lead/Principal (8+ years)' }
  ];

  constructor(private router: Router) {}

  addItem(type: 'requirement' | 'responsibility' | 'benefit' | 'skill') {
    const inputMap = {
      requirement: this.requirementInput,
      responsibility: this.responsibilityInput,
      benefit: this.benefitInput,
      skill: this.skillInput
    };

    const value = inputMap[type].trim();
    if (value) {
      this.job[type === 'requirement' ? 'requirements' : 
                type === 'responsibility' ? 'responsibilities' :
                type === 'benefit' ? 'benefits' : 'skills'].push(value);
      
      // Clear input
      if (type === 'requirement') this.requirementInput = '';
      else if (type === 'responsibility') this.responsibilityInput = '';
      else if (type === 'benefit') this.benefitInput = '';
      else this.skillInput = '';
    }
  }

  removeItem(type: 'requirements' | 'responsibilities' | 'benefits' | 'skills', index: number) {
    this.job[type].splice(index, 1);
  }

  saveDraft() {
    console.log('Saving draft:', this.job);
    // Save logic here
    this.router.navigate(['/dashboard/recruiter/listings']);
  }

  postJob() {
    console.log('Posting job:', this.job);
    // Post logic here
    this.router.navigate(['/dashboard/recruiter/listings']);
  }

  cancel() {
    this.router.navigate(['/dashboard/recruiter/listings']);
  }
}
