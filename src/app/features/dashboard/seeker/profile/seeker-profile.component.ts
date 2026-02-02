import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../shared/services/profile.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { AiFeedback, Profile } from '../../../../shared/models/profile.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-seeker-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seeker-profile.component.html',
  styleUrl: './seeker-profile.component.css',
})
export class SeekerProfileComponent implements OnInit {
  user = {
    id: 7,
    name: '',
    email: '',
    role: 'SEEKER',
    avatar: '',
  };

  profileId: number = 0;
  bio = '';
  skills = '';
  resumeUrl = '';
  avatarUrl = '';
  isAnalyzing = false;
  isSaving = false;
  isLoading = true;
  isUploadingResume = false;
  isUploadingAvatar = false;
  errorMessage = '';
  uploadErrorMessage = '';
  selectedResumeFile: File | null = null;
  selectedAvatarFile: File | null = null;
  aiFeedback: AiFeedback | null = null;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private uploadService: UploadService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = {
        id: currentUser.id,
        name: '',
        email: currentUser.email,
        role: currentUser.role,
        avatar: '',
      };

      this.profileService.getProfile(currentUser.id).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.profileId = response.data.id;
            this.user.name = response.data.user.name; // Get name from profile response
            this.bio = response.data.bio || '';
            this.skills = response.data.skills || '';
            this.resumeUrl = response.data.resumeUrl || '';
            this.avatarUrl = response.data.avatarUrl || '';

            // Parse AI feedback if exists
            if (response.data.aiFeedback) {
              try {
                this.aiFeedback = JSON.parse(response.data.aiFeedback);
              } catch (e) {
                console.error('Error parsing AI feedback:', e);
              }
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading profile:', error);
          this.errorMessage = 'Failed to load profile. Please try again.';
        },
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'User not found. Please login again.';
    }
  }

  handleSave(event: Event) {
    event.preventDefault();
    this.isSaving = true;
    this.errorMessage = '';

    // Remove duplicate skills before saving
    const uniqueSkills = this.getSkillsArray().join(', ');

    const profileData = {
      userId: this.user.id,
      bio: this.bio,
      skills: uniqueSkills,
      resumeUrl: this.resumeUrl,
      avatarUrl: this.avatarUrl,
      aiFeedback: this.aiFeedback ? JSON.stringify(this.aiFeedback) : '',
    };

    this.profileService.saveProfile(profileData).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          // Update local skills with deduplicated version
          this.skills = uniqueSkills;
          this.toastService.success('Profile updated successfully!');
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error saving profile:', error);
        this.errorMessage =
          error.error?.message || 'Failed to save profile. Please try again.';
      },
    });
  }

  runAiReview() {
    this.isAnalyzing = true;

    // Simulate AI analysis
    setTimeout(() => {
      this.aiFeedback = {
        strengths: [
          'Strong full-stack development background',
          'Excellent problem-solving abilities',
          'Experience with modern frameworks',
        ],
        marketFit:
          'Your profile aligns well with senior developer positions in tech companies. Consider highlighting your leadership experience.',
      };
      this.isAnalyzing = false;
    }, 2000);
  }

  resetAiReview() {
    this.aiFeedback = null;
  }

  getSkillsArray(): string[] {
    const skillsArray = this.skills
      .split(',')
      .filter((s) => s.trim())
      .map((s) => s.trim());

    // Remove duplicates (case-insensitive)
    const uniqueSkills = skillsArray.filter(
      (skill, index, self) =>
        index ===
        self.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
    );

    return uniqueSkills;
  }

  getAvatarUrl(): string {
    return (
      this.avatarUrl ||
      this.user.avatar ||
      `https://picsum.photos/seed/${this.user.id}/400/400`
    );
  }

  // File upload handlers
  onResumeFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        this.uploadErrorMessage = 'Please select a PDF file for resume.';
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.uploadErrorMessage = 'Resume file size must be less than 10MB.';
        return;
      }

      this.selectedResumeFile = file;
      this.uploadErrorMessage = '';
      this.uploadResume();
    }
  }

  onAvatarFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.uploadErrorMessage = 'Please select an image file for avatar.';
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadErrorMessage = 'Avatar file size must be less than 5MB.';
        return;
      }

      this.selectedAvatarFile = file;
      this.uploadErrorMessage = '';
      this.uploadAvatar();
    }
  }

  uploadResume() {
    if (!this.selectedResumeFile) return;

    this.isUploadingResume = true;
    this.uploadErrorMessage = '';

    this.uploadService.uploadResume(this.selectedResumeFile).subscribe({
      next: (response) => {
        this.isUploadingResume = false;
        if (response.success && response.url) {
          this.resumeUrl = response.url;
          this.toastService.success('Resume uploaded successfully!');
        }
      },
      error: (error) => {
        this.isUploadingResume = false;
        console.error('Error uploading resume:', error);
        this.uploadErrorMessage = 'Failed to upload resume. Please try again.';
      },
    });
  }

  uploadAvatar() {
    if (!this.selectedAvatarFile) return;

    this.isUploadingAvatar = true;
    this.uploadErrorMessage = '';

    this.uploadService.uploadAvatar(this.selectedAvatarFile).subscribe({
      next: (response) => {
        this.isUploadingAvatar = false;
        if (response.success && response.url) {
          this.avatarUrl = response.url;
          this.user.avatar = response.url;
          this.toastService.success('Avatar uploaded successfully!');
        }
      },
      error: (error) => {
        this.isUploadingAvatar = false;
        console.error('Error uploading avatar:', error);
        this.uploadErrorMessage = 'Failed to upload avatar. Please try again.';
      },
    });
  }

  triggerResumeUpload() {
    const fileInput = document.getElementById(
      'resumeFileInput',
    ) as HTMLInputElement;
    fileInput?.click();
  }

  triggerAvatarUpload() {
    const fileInput = document.getElementById(
      'avatarFileInput',
    ) as HTMLInputElement;
    fileInput?.click();
  }

  getResumeFileName(): string {
    if (!this.resumeUrl) return '';

    try {
      // Extract filename from URL
      const url = new URL(this.resumeUrl);
      const pathname = url.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      return decodeURIComponent(filename);
    } catch (e) {
      return 'Resume.pdf';
    }
  }
}
