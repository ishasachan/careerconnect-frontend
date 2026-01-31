export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string;
  department: string;
  applicantsCount: number;
  postedDate: string;
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
