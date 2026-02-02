import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  JobResponse,
  JobsResponse,
  JobSearchParams,
} from '../models/job.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(searchParams?: JobSearchParams): Observable<JobsResponse> {
    let params = new HttpParams();

    if (searchParams) {
      if (searchParams.keyword) {
        params = params.set('keyword', searchParams.keyword);
      }
      if (searchParams.type) {
        params = params.set('type', searchParams.type);
      }
      if (searchParams.location) {
        params = params.set('location', searchParams.location);
      }
    }

    return this.http.get<JobsResponse>(this.apiUrl, { params });
  }

  getJobById(id: number): Observable<JobResponse> {
    return this.http.get<JobResponse>(`${this.apiUrl}/${id}`);
  }

  // Recruiter APIs
  postJob(recruiterId: number, jobData: any): Observable<JobResponse> {
    return this.http.post<JobResponse>(
      `${this.apiUrl}/recruiter/${recruiterId}`,
      jobData,
    );
  }

  updateJob(jobId: number, jobData: any): Observable<JobResponse> {
    return this.http.put<JobResponse>(`${this.apiUrl}/${jobId}`, jobData);
  }

  deleteJob(jobId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${jobId}`,
    );
  }

  pauseJob(jobId: number): Observable<JobResponse> {
    return this.http.patch<JobResponse>(`${this.apiUrl}/${jobId}/pause`, {});
  }

  resumeJob(jobId: number): Observable<JobResponse> {
    return this.http.patch<JobResponse>(`${this.apiUrl}/${jobId}/resume`, {});
  }

  closeJob(jobId: number): Observable<JobResponse> {
    return this.http.patch<JobResponse>(`${this.apiUrl}/${jobId}/close`, {});
  }

  reopenJob(jobId: number): Observable<JobResponse> {
    return this.http.patch<JobResponse>(`${this.apiUrl}/${jobId}/reopen`, {});
  }

  getRecruiterJobs(recruiterId: number): Observable<JobsResponse> {
    return this.http.get<JobsResponse>(
      `${this.apiUrl}/recruiter/${recruiterId}`,
    );
  }
}
