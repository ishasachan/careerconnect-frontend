import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterProfileService } from '../../../../shared/services/recruiter-profile.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { UploadService } from '../../../../shared/services/upload.service';
import {
  RecruiterInfo,
  CompanyInfo,
} from '../../../../shared/models/recruiter-profile.model';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-profile.component.html',
  styleUrl: './recruiter-profile.component.css',
})
export class RecruiterProfileComponent implements OnInit {
  recruiter: RecruiterInfo = {
    name: '',
    email: '',
    phone: '',
    position: '',
    avatarUrl: '',
  };

  company: CompanyInfo = {
    name: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    description: '',
  };

  hiringPreferences = {
    roles: [
      'Software Engineer',
      'Product Manager',
      'Designer',
      'Data Scientist',
      'DevOps Engineer',
    ],
    experienceLevels: [
      'Entry Level',
      'Mid Level',
      'Senior',
      'Lead',
      'Director',
    ],
    locations: ['Remote', 'On-site', 'Hybrid'],
  };

  selectedRoles: string[] = [];
  selectedExperience: string[] = [];
  selectedLocations: string[] = [];

  isEditing = false;
  isLoading = false;
  isSaving = false;
  isUploadingAvatar = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private recruiterProfileService: RecruiterProfileService,
    private authService: AuthService,
    private uploadService: UploadService,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const currentUser = this.authService.getCurrentUser();
    console.log('Loading profile for user:', currentUser);

    if (currentUser) {
      // Pre-populate email from current user
      this.recruiter.email = currentUser.email;

      this.isLoading = true;
      console.log('Calling API: GET /api/recruiter/profile/' + currentUser.id);

      this.recruiterProfileService
        .getRecruiterProfile(currentUser.id)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Profile loaded successfully:', response);
            console.log(
              'Response data structure:',
              JSON.stringify(response.data, null, 2),
            );

            if (response.success && response.data) {
              // Load all profile data with detailed logging
              if (response.data.recruiter) {
                console.log(
                  '📝 Populating recruiter fields from API:',
                  response.data.recruiter,
                );
                this.recruiter = {
                  ...this.recruiter,
                  ...response.data.recruiter,
                };
                console.log('📝 Recruiter after update:', this.recruiter);
              }

              if (response.data.company) {
                console.log(
                  '🏢 Populating company fields from API:',
                  response.data.company,
                );
                this.company = {
                  ...this.company,
                  ...response.data.company,
                };
                console.log('🏢 Company after update:', this.company);
              }

              // Parse preferences from comma-separated strings to arrays
              if (response.data.preferences) {
                console.log(
                  '⚙️ Raw preferences from API:',
                  response.data.preferences,
                );

                this.selectedRoles = response.data.preferences.roles
                  ? response.data.preferences.roles
                      .split(',')
                      .map((r) => r.trim())
                      .filter((r) => r)
                  : [];
                this.selectedExperience = response.data.preferences
                  .experienceLevels
                  ? response.data.preferences.experienceLevels
                      .split(',')
                      .map((e) => e.trim())
                      .filter((e) => e)
                  : [];
                this.selectedLocations = response.data.preferences.locations
                  ? response.data.preferences.locations
                      .split(',')
                      .map((l) => l.trim())
                      .filter((l) => l)
                  : [];

                console.log('⚙️ Parsed preferences arrays:', {
                  selectedRoles: this.selectedRoles,
                  selectedExperience: this.selectedExperience,
                  selectedLocations: this.selectedLocations,
                });
              }
              console.log('Profile data loaded into form:', {
                recruiter: this.recruiter,
                company: this.company,
                selectedRoles: this.selectedRoles,
                selectedExperience: this.selectedExperience,
                selectedLocations: this.selectedLocations,
              });
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error loading profile:', error);
            console.error('Error status:', error.status);
            console.error('Error details:', error.error);

            // If profile doesn't exist (404), pre-fill with user data and enable edit mode
            if (error.status === 404) {
              console.log('No profile found - user can create one');
              this.recruiter.email = currentUser.email;
              this.isEditing = true; // Automatically enable edit mode for new profile
              console.log(
                'Pre-filled email for new profile:',
                this.recruiter.email,
              );
            } else {
              this.errorMessage = `Failed to load profile: ${error.error?.message || error.message || 'Please try again.'}`;
            }
          },
        });
    } else {
      console.error('No current user found!');
      this.errorMessage = 'User not authenticated. Please log in again.';
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const profileData = {
      recruiter: this.recruiter,
      company: this.company,
      preferences: {
        roles: this.selectedRoles,
        experience: this.selectedExperience,
        locations: this.selectedLocations,
      },
    };

    console.log('Saving profile with data:', profileData);

    this.recruiterProfileService
      .saveRecruiterProfile(currentUser.id, profileData)
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          console.log('Profile saved successfully:', response);

          if (response.success) {
            this.isEditing = false;
            this.successMessage = 'Profile saved successfully!';

            // Reload the profile to get the updated data from server
            setTimeout(() => {
              this.successMessage = '';
              this.loadProfile();
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to save profile';
          }
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error saving profile:', error);
          console.error('Error details:', error.error);
          this.errorMessage = `Failed to save profile: ${error.error?.message || error.message || 'Please try again.'}`;
        },
      });
  }

  handleAvatarUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      this.isUploadingAvatar = true;
      this.errorMessage = '';

      // Upload to server
      this.uploadService.uploadAvatar(file).subscribe({
        next: (response) => {
          this.isUploadingAvatar = false;
          if (response.success && response.url) {
            this.recruiter.avatarUrl = response.url;
            console.log('Avatar uploaded successfully:', response.url);
          } else {
            this.errorMessage = 'Failed to upload avatar';
          }
        },
        error: (error) => {
          this.isUploadingAvatar = false;
          console.error('Error uploading avatar:', error);
          this.errorMessage = 'Failed to upload avatar. Please try again.';
        },
      });
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
