/*import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public isAuthenticated:boolean=false
private baseUrl = 'http://127.0.0.1:8000/'

  constructor(private router: Router, private http :HttpClient) {}
 
  login(emailInput: string, passwordInput: string): Observable<any> {
    // Simulated authentication check (Replace with API call)
    const loginrequest = {
      email :emailInput,
      mot_de_passe:passwordInput
    }
  return this.http.post<any>(`${this.baseUrl}login/`, loginrequest)
  }


  signup(userData: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}users/`, userData);
  }
 
  logout(): void {

    this.isAuthenticated = false
    
    this.router.navigate(['/login']);
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private router: Router, private http: HttpClient) {}

  login(emailInput: string, passwordInput: string): Observable<any> {
    const loginrequest = {
      email: emailInput,
      mot_de_passe: passwordInput
    };
    return this.http.post<any>(`${this.baseUrl}login/`, loginrequest);
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}users/`, userData);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
