import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobResponse, JobsResponse, JobSearchParams } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:9090/api/jobs';

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
}
