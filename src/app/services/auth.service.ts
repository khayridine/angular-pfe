
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from './../entity/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/';

  constructor(private router: Router, private http: HttpClient) {}

  login(emailInput: string, passwordInput: string): Observable<any> {
    const loginrequest = {
      email: emailInput,
      mot_de_passe: passwordInput
    };
    return this.http.post<any>(`${this.baseUrl}login/`, loginrequest);
  }

  signup(userData: UserData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}signup/`, userData);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.get<any>(`${this.baseUrl}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  updateProfile(formData: FormData):Observable<any>{
    const token =localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ${token}',
    });
    return this.http.put<any>('http://localhost:8000/auth/updateProfile', formData, { headers });
    
  }
  
}
