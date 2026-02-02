export interface Job {
  id: number;
  recruiterId?: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status?: string;
  description: string;
  requirements: string;
  department: string;
  applicantsCount: number;
  postedDate: string;
  createdAt?: string;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}
export interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
}
export interface JobSearchParams {
  keyword?: string;
  type?: string;
  location?: string;
}
