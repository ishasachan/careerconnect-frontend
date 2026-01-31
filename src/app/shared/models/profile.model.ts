export interface AiFeedback {
  strengths: string[];
  marketFit: string;
}

export interface ProfileUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Profile {
  id: number;
  user: ProfileUser;
  bio: string;
  skills: string;
  resumeUrl: string;
  avatarUrl: string;
  aiFeedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export interface SaveProfileRequest {
  userId: number;
  bio: string;
  skills: string;
  resumeUrl: string;
  avatarUrl: string;
  aiFeedback: string;
}
