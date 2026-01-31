import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-profile.component.html',
  styleUrl: './recruiter-profile.component.css'
})
export class RecruiterProfileComponent {
  recruiter = {
    name: 'Sarah Smith',
    email: 'sarah.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Recruiter',
    avatar: ''
  };

  company = {
    name: 'TechCorp',
    industry: 'Technology',
    size: '1000-5000',
    website: 'https://techcorp.com',
    location: 'San Francisco, CA',
    description: 'Leading technology company focused on innovation and talent development.'
  };

  hiringPreferences = {
    roles: ['Software Engineer', 'Product Manager', 'Designer'],
    experienceLevels: ['Entry Level', 'Mid Level', 'Senior'],
    locations: ['Remote', 'On-site', 'Hybrid']
  };

  selectedRoles: string[] = ['Software Engineer'];
  selectedExperience: string[] = ['Mid Level'];
  selectedLocations: string[] = ['Remote'];

  isEditing = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.isEditing = false;
    // Save logic here
    console.log('Profile saved', {
      recruiter: this.recruiter,
      company: this.company,
      preferences: {
        roles: this.selectedRoles,
        experience: this.selectedExperience,
        locations: this.selectedLocations
      }
    });
  }

  handleAvatarUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.recruiter.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleSelection(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
  }

  isSelected(array: string[], item: string): boolean {
    return array.includes(item);
  }
}
