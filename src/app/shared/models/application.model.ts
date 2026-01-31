export interface Application {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: Date;
  status: 'APPLIED' | 'UNDER REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED';
  
  // Application details
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  yearsOfExperience?: string;
  currentCompany?: string;
  resumeUrl?: string;
}
