export interface RecruiterInfo {
  id?: number;
  userId?: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  avatarUrl: string;
}
export interface CompanyInfo {
  id?: number;
  recruiterId?: number;
  name: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  description: string;
}
export interface HiringPreferences {
  id?: number;
  recruiterId?: number;
  roles: string;
  experienceLevels: string;
  locations: string;
}

export interface RecruiterProfile {
  recruiter: RecruiterInfo;
  company: CompanyInfo;
  preferences: HiringPreferences;
}

export interface RecruiterProfileResponse {
  success: boolean;
  message: string;
  data: RecruiterProfile | null;
}

export interface SaveRecruiterProfileRequest {
  recruiter: RecruiterInfo;
  company: CompanyInfo;
  preferences: {
    roles: string[];
    experience: string[];
    locations: string[];
  };
}
