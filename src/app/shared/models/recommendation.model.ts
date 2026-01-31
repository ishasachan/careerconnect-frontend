export interface Recommendation {
  jobId: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  match: number;
}

export interface RecommendationsResponse {
  success: boolean;
  message: string;
  data: Recommendation[];
}
