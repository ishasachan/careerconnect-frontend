import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RecruiterProfileResponse,
  SaveRecruiterProfileRequest,
} from '../models/recruiter-profile.model';

@Injectable({
  providedIn: 'root',
})
export class RecruiterProfileService {
  private apiUrl = 'http://localhost:9090/api/recruiter/profile';

  constructor(private http: HttpClient) {}

  getRecruiterProfile(userId: number): Observable<RecruiterProfileResponse> {
    return this.http.get<RecruiterProfileResponse>(`${this.apiUrl}/${userId}`);
  }

  saveRecruiterProfile(
    userId: number,
    profileData: SaveRecruiterProfileRequest,
  ): Observable<RecruiterProfileResponse> {
    return this.http.post<RecruiterProfileResponse>(
      `${this.apiUrl}/${userId}`,
      profileData,
    );
  }
}
