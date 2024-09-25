import { Injectable } from '@angular/core';
import { ProfileModule } from './profile.module'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: ProfileModule
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  SendOtpByUserId(userId: string, password: string) {
    let params = new HttpParams();
    params = params.append('UserId', userId);
    params = params.append('Password', password);
    return this.http.post(environment.apiUrl + 'SendOtpByUserId', {
    }, {params: params})
  }

  GetMode() {
    return this.http.get(environment.apiUrl + 'GetOtpMode')
  }

  verifyOtp(userId: string, otp: string) {
    let params = new HttpParams();
    params = params.append('UserId', userId);
    params = params.append('Otp', otp);
    return this.http.post(environment.apiUrl + 'VerifyOtp', {
    }, {params: params})
  }

  changePassword(userId: string, password: string) {
    let params = new HttpParams();
    params = params.append('UserId', userId);
    params = params.append('Password', password);
    return this.http.post(environment.apiUrl + 'ChangePassword', {
    }, {params: params})
  }
}
