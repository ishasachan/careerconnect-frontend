import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  selectedRole: 'SEEKER' | 'RECRUITER' = 'SEEKER';
  showPassword = false;
  submitted = false;
  errorMessage = '';
  isLoading = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['SEEKER'],
    });
  }

  selectRole(role: 'SEEKER' | 'RECRUITER') {
    this.selectedRole = role;
    this.registerForm.patchValue({ role });
  }

  signup() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.signup(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Signup successful:', response);

          // Navigate based on user role
          const role = this.registerForm.value.role.toLowerCase();
          this.router.navigate([`/dashboard/${role}`]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Signup error:', error);
          this.errorMessage =
            error.error?.message || 'Signup failed. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
