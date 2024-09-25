import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


import { HttpParameterCodec } from '@angular/common/http';
export class CustomHttpParamEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }
    encodeValue(value: string): string {
            return encodeURIComponent(value);
    }
    decodeKey(key: string): string {
            return decodeURIComponent(key);
    }
    decodeValue(value: string): string {
            return decodeURIComponent(value);
    }
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  
  constructor(private http: HttpClient) { }

  // login(postData) {
  //   let params = new HttpParams()
  //   params = params.append('UserName', postData.userName)
  //   params = params.append('Password', postData.password)
  //   params = params.append('IMEI', postData.imei)
  //   return this.http.get(environment.apiUrl + 'CheckLogin', {params: params})
  // }
  login(encryptUser,encryptPassword,imei) {
    console.log('encryptUser',encryptUser);

    // let params = new HttpParams()
    let params = new HttpParams({encoder: new CustomHttpParamEncoder()});

    params = params.append('UserName', decodeURIComponent(encryptUser))
    params = params.append('Password', encryptPassword)
    params = params.append('IMEI', imei)
    return this.http.get(environment.apiUrl + 'CheckLogin', {params: params})
  }

  tokenLogin(grant_type,encryptUser,encryptPassword) {
    let postStr =  'grant_type='+grant_type+'&userName='+encryptUser+'&password='+encryptPassword;
    console.log('postStr',postStr);
    return this.http.post(environment.apiUrl + 'token', postStr,  {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })
  }

  regenerateToken(refresh_token) {
    let postStr =  'grant_type='+'refresh_token'+'&refresh_token='+refresh_token;
    console.log('postStr',postStr);
    return this.http.post(environment.apiUrl + 'token', postStr,  {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })

}

  getLogo() {
    return this.http.get(environment.apiUrl + 'GetLogoDetails')
  }
}
