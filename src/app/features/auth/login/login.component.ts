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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);

          // Navigate based on user role
          const user = this.authService.getCurrentUser();
          const role = user?.role?.toLowerCase() || 'seeker';

          this.router.navigate([`/dashboard/${role}`]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
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

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  loginWithDemo(userType: 'seeker' | 'recruiter' | 'admin') {
    const demoAccounts = {
      seeker: { email: 'john.doe@example.com', password: 'seeker123' },
      recruiter: { email: 'sarah.smith@example.com', password: 'recruiter123' },
      admin: { email: 'admin@example.com', password: 'admin123' },
    };

    const account = demoAccounts[userType];
    this.loginForm.patchValue({
      email: account.email,
      password: account.password,
    });

    // Auto-submit after setting values
    this.login();
  }
}
