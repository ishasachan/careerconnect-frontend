import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AiFeedback {
  strengths: string[];
  marketFit: string;
}

@Component({
  selector: 'app-seeker-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seeker-profile.component.html',
  styleUrl: './seeker-profile.component.css'
})
export class SeekerProfileComponent {
  user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'JOB_SEEKER',
    avatar: ''
  };

  bio = '';
  skills = '';
  isAnalyzing = false;
  isSaving = false;
  aiFeedback: AiFeedback | null = null;

  constructor(private router: Router) {}

  handleSave(event: Event) {
    event.preventDefault();
    this.isSaving = true;
    
    // Simulate save operation
    setTimeout(() => {
      this.isSaving = false;
      alert('Profile updated successfully!');
    }, 1500);
  }

  runAiReview() {
    this.isAnalyzing = true;
    
    // Simulate AI analysis
    setTimeout(() => {
      this.aiFeedback = {
        strengths: [
          'Strong full-stack development background',
          'Excellent problem-solving abilities',
          'Experience with modern frameworks'
        ],
        marketFit: 'Your profile aligns well with senior developer positions in tech companies. Consider highlighting your leadership experience.'
      };
      this.isAnalyzing = false;
    }, 2000);
  }

  resetAiReview() {
    this.aiFeedback = null;
  }

  getSkillsArray(): string[] {
    return this.skills.split(',').filter(s => s.trim()).map(s => s.trim());
  }

  getAvatarUrl(): string {
    return this.user.avatar || `https://picsum.photos/seed/${this.user.id}/400/400`;
  }
}
