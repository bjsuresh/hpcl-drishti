import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( ) { 
    
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token?true:false;
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('GroupId')
    localStorage.removeItem('UserId')
  }


  // Call the checkTokenValidity function periodically
  // setInterval(() => {
  //   checkTokenValidity();
  // }, TOKEN_REFRESH_INTERVAL);


  // function refreshToken(): Observable<any> {
    // Send a request to your server to refresh the token
    // Return an observable that resolves with the new token data
    // or rejects with an error in case of failure
  // }

  //  logout() {
  //   // Clear user data and redirect to the login page
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('expiresAt');
  //   localStorage.removeItem('loginTime');
  //   // Redirect to the login page
  //   // this.router.navigate(['/login']);
  // }

}