import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse, SaveProfileRequest } from '../models/profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`);
  }

  saveProfile(profileData: SaveProfileRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.apiUrl}/save`, profileData);
  }
}
