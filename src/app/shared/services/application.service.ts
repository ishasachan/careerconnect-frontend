import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApplicationRequest, ApplicationResponse, ApplicationsResponse, Application } from '../models/application.model';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:9090/api/applications';

  constructor(
    private http: HttpClient,
    private jobService: JobService
  ) {}

  submitApplication(applicationData: ApplicationRequest): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>(`${this.apiUrl}/apply`, applicationData);
  }

  getUserApplications(userId: number): Observable<ApplicationsResponse> {
    return this.http.get<ApplicationsResponse>(`${this.apiUrl}/user/${userId}`).pipe(
      switchMap(response => {
        if (response.success && response.data && response.data.length > 0) {
          // Fetch job details for each application
          const jobRequests = response.data.map(app => 
            this.jobService.getJobById(app.jobId).pipe(
              map(jobResponse => ({
                ...app,
                jobTitle: jobResponse.data.title,
                company: jobResponse.data.company,
                location: jobResponse.data.location,
                salary: jobResponse.data.salary
              }))
            )
          );
          
          return forkJoin(jobRequests).pipe(
            map(applicationsWithJobs => ({
              success: response.success,
              message: response.message,
              data: applicationsWithJobs
            }))
          );
        }
        return new Observable<ApplicationsResponse>(observer => {
          observer.next(response);
          observer.complete();
        });
      })
    );
  }
}
