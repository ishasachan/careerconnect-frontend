import { Job } from './job.model';

export interface Application {
  id: number;
  userId: number;
  job: Job;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  currentCompany: string;
  resumeUrl: string;
  coverLetter: string;
  status:
    | 'APPLIED'
    | 'UNDER_REVIEW'
    | 'SHORTLISTED'
    | 'INTERVIEW'
    | 'HIRED'
    | 'REJECTED';
  appliedDate: string;
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
