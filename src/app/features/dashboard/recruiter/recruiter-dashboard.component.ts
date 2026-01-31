import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, StatCardComponent],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrl: './recruiter-dashboard.component.css'
})
export class RecruiterDashboardComponent {
  jobs = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      applicants: 12,
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'Product Designer',
      applicants: 8,
      type: 'Full-time'
    },
    {
      id: 3,
      title: 'Backend Developer (Node.js)',
      applicants: 4,
      type: 'Contract'
    }
  ];

  // Chart data
  applicationVolumeData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 18 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 24 },
    { name: 'Fri', value: 32 },
    { name: 'Sat', value: 10 },
    { name: 'Sun', value: 8 }
  ];

  // Chart options
  view: [number, number] | undefined = undefined;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  showGridLines = false;
  yAxisLabel = 'Applications';
  colorScheme: any = {
    domain: ['#6366F1']
  };

  constructor(private router: Router) {}

  viewAllListings() {
    this.router.navigate(['/dashboard/recruiter/listings']);
  }

  viewJob(jobId: number) {
    this.router.navigate(['/dashboard/recruiter/listings', jobId]);
  }
}
