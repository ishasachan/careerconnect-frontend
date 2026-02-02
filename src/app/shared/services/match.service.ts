import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchResponse {
  success: boolean;
  message: string;
  data: {
    matchScore: number;
    skillScore: number;
    experienceScore: number;
    profileScore: number;
    feedback: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  checkCompatibility(userId: number, jobId: number): Observable<MatchResponse> {
    return this.http.post<MatchResponse>(`${this.apiUrl}/match/check`, {
      userId,
      jobId,
    });
  }
}
