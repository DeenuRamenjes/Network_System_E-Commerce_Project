import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  register(username: string, name: string, email: string, phone: string, password: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(
      `${this.apiUrl}/signup`,
      { username, name, email, phone, password },
      { withCredentials: true }
    );
  }
}
