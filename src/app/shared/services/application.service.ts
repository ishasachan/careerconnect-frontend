import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApplicationRequest,
  ApplicationResponse,
  ApplicationsResponse,
} from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  submitApplication(
    applicationData: ApplicationRequest,
  ): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>(
      `${this.apiUrl}/apply`,
      applicationData,
    );
  }

  getUserApplications(userId: number): Observable<ApplicationsResponse> {
    return this.http.get<ApplicationsResponse>(`${this.apiUrl}/user/${userId}`);
  }

  getRecruiterApplicants(
    recruiterId: number,
  ): Observable<ApplicationsResponse> {
    return this.http.get<ApplicationsResponse>(
      `${this.apiUrl}/recruiter/${recruiterId}`,
    );
  }

  updateApplicationStatus(
    applicationId: number,
    status: string,
  ): Observable<ApplicationResponse> {
    return this.http.patch<ApplicationResponse>(
      `${this.apiUrl}/${applicationId}/status?status=${status}`,
      {},
    );
  }

  resetApplicationStatus(
    applicationId: number,
  ): Observable<ApplicationResponse> {
    return this.http.patch<ApplicationResponse>(
      `${this.apiUrl}/${applicationId}/reset`,
      {},
    );
  }
}
