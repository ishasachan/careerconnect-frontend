export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'SEEKER' | 'RECRUITER';
}

export interface AuthResponse {
  userId: number;
  token: string;
  role: string;
  email: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}
