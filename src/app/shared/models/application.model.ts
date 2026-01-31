export interface Application {
  id: number;
  userId: number;
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  currentCompany: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED';
  appliedDate: string;
  
  // Additional fields for display (will be populated from job data)
  jobTitle?: string;
  company?: string;
  location?: string;
  salary?: string;
}

export interface ApplicationRequest {
  userId: number;
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  currentCompany: string;
  resumeUrl: string;
  coverLetter: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: Application;
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
}
