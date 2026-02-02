import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse, SaveProfileRequest } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:9090/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`);
  }

  saveProfile(profileData: SaveProfileRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.apiUrl}/save`, profileData);
  }
}
