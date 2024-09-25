import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { tap, map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  logState: any;

  constructor(private router: Router, private aRoute: ActivatedRoute, public loadingController: LoadingController, public toastController: ToastController,  private loginService: LoginService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(localStorage.getItem('token')) {
      // var token = localStorage.getItem('token');
      // request = this.attachToken(request, token);

      request = request.clone({
        setHeaders: {
          Authorization: `bearer ${localStorage.getItem('token')}`,
        }
      })
    } else {
      request = request.clone({
        setHeaders: {
        }
      })  
    }
    console.log("request", localStorage.getItem('token'))
    let temp = request.url.split('/')
    let loading = false
    if(temp[temp.length - 1] == 'ReadRawValues' || temp[temp.length -1] == 'ReadProcessed') {
        // console.log('000000000000000000000')
      loading = true
      this.presentLoading()
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event', event);
          // let resTemp = request.url.split('/')
          // if(resTemp[resTemp.length - 1] == 'ReadRawValues' || resTemp[resTemp.length -1] == 'ReadProcessed') {
          if(loading) {
            this.hideLoader()
          }
          // }
        }
       
        return event;
      }),

      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          const autoLog = localStorage.getItem('auto_log');
        
          if(autoLog === 'true' ){
            console.log('authErrorHandle')

          //   this.handleUnauthorizedError(request, next);

          //   // Token expired, try to refresh it
          //   // var reftoken = localStorage.getItem('refresh_token');

          //   // this.loginService.regenerateToken(reftoken).subscribe(res => {
          //   //     // If the refresh was successful, retry the original request with the new token
          //   //     console.log("token",res,res['access_token']);
          //   //     if (res['access_token']) {
          //   //       request = request.clone({
          //   //         setHeaders: {
          //   //           Authorization: `bearer ${res['access_token']}`,
          //   //         },
          //   //       });
          //   //       return next.handle(request);
          //   //     }
          //   //     // If refresh failed, navigate to the login page
          //   //     this.router.navigate(['/login']);
          //   //     // return EMPTY; // Return an empty observable to stop the original request
          //   //   }
          //   // );
            
          //   // localStorage.removeItem('token')
          //   // localStorage.removeItem('GroupId')
          //   // localStorage.removeItem('UserId')
          //   // localStorage.removeItem('query')
          //   // localStorage.removeItem('imei')
          //   // localStorage.setItem('login_state', 'false');
          //   // if (localStorage.getItem('remberMe') == 'false') {
          //   //   localStorage.removeItem('password')
          //   //   localStorage.removeItem('remberMe')
          //   //   localStorage.removeItem('userName')
          //   // }
          //   // localStorage.setItem('role', error.error['roleName'])

          }
          else{
            console.log('authError')
            // this.openLoginDialog()
            localStorage.removeItem('token')  
            localStorage.removeItem('GroupId')
            localStorage.removeItem('UserId')
            localStorage.removeItem('query')
            // localStorage.removeItem('imei')
            // localStorage.setItem('login_state', 'false');
            // if (localStorage.getItem('remberMe') == 'false') {
            //   localStorage.removeItem('password')
            //   localStorage.removeItem('remberMe')
            //   localStorage.removeItem('userName')
            // }
            // localStorage.setItem('role', error.error['roleName'])

            this.router.navigate(['/login'], { relativeTo: this.aRoute });
          }
        }
        else {
          const autoLog = localStorage.getItem('auto_log');
        
          if(autoLog === 'true' ){
            console.log('authErrorHandle')
          }
          else {
            // Handle 500 Internal Server Error
            console.log('Internal Server Error');
            localStorage.removeItem('token')
            localStorage.removeItem('GroupId')
            localStorage.removeItem('UserId')
            localStorage.removeItem('query')
            // localStorage.removeItem('imei')
            // localStorage.setItem('login_state', 'false');
            // if (localStorage.getItem('remberMe') == 'false') {
            //   localStorage.removeItem('password')
            //   localStorage.removeItem('remberMe')
            //   localStorage.removeItem('userName')
            // }
            // localStorage.setItem('role', error.error['roleName'])

            this.router.navigate(['/login'], { relativeTo: this.aRoute });
          }
          // You can perform actions for 500 error here
          // For instance, show a message or handle differently than 401 error
        } 
        
        return throwError(error);
      }));
  }

  private attachToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    var reftoken = 'c96ee144-7e4b-4070-a4c5-51360a06a4b2';

    console.log("ref-token",reftoken);
     this.loginService.regenerateToken(reftoken).pipe(
      catchError((error) => {
        // Handle the error here
        if (error.status === 400) {
          // Perform some error handling like logging, redirect, etc.
          var encryptUser = localStorage.getItem('encryptUser');
            var encodedEncryptPassword = localStorage.getItem('encodedEncryptPassword');
            var encryptCheckUser = localStorage.getItem('encryptCheckUser');
            var encryptCheckPassword = localStorage.getItem('encryptCheckPassword');
            var grant_type = localStorage.getItem('grant_type');
            var imei = localStorage.getItem('imei');
        
        
            this.loginService.tokenLogin(grant_type,encryptUser,encodedEncryptPassword).subscribe((resFormApi) => {
              console.log('res',resFormApi);
              console.log("app login successfully");
            
                localStorage.setItem('token', resFormApi['access_token']);
                localStorage.setItem('expires_in',resFormApi['expires_in']);
                localStorage.setItem('expires',resFormApi['.expires']);
                localStorage.setItem('refresh_token', resFormApi['refresh_token']);
              
                localStorage.setItem('encryptCheckUser', encryptCheckUser)
                localStorage.setItem('encryptCheckPassword', encryptCheckPassword)
          
                // this.loginService.login( encryptCheckUser,encryptCheckPassword,imei).subscribe((resFormApi: string) => {
                //   // this.loading.dismiss();
                //   console.log("response", JSON.parse(resFormApi))
                  
                // }, (err) => {
                //   console.log(err)
                //   // this.loading.dismiss()
                //   this.presentToast('Unable to reach server! Please verify the SAMA MP URL and contact Administrator.')
                // })
            
            }, (err) => {
              console.log(err)
              // this.loading.dismiss()
              // this.presentToast('Unable to reach server! Please verify the SAMA MP URL and contact Administrator.')
            })
        }
        // Rethrow the error to maintain the error flow
        return throwError(error);
      }),
      mergeMap((res) => {
        localStorage.setItem('token', res['access_token']);
        localStorage.setItem('expires_in', res['expires_in']);
        localStorage.setItem('expires', res['.expires']);
        localStorage.setItem('refresh_token', res['refresh_token']);
        const newRequest = this.attachToken(request, res['access_token']);
        console.log("newreq", newRequest);
        
        this.router.navigate(['/dashboard/viewpages'], { relativeTo: this.aRoute });

        return next.handle(newRequest);
      })
    );
    // .subscribe(
    //   (res) => {
    //     localStorage.setItem('token', res['access_token']);
    //       localStorage.setItem('expires_in',res['expires_in']);
    //       localStorage.setItem('expires',res['.expires']);
    //       localStorage.setItem('refresh_token', res['refresh_token']);
          
    //     const newRequest = this.attachToken(request, res['access_token']);
    //     console.log("newreq",newRequest);
    //     return next.handle(newRequest);
        
    //   });


  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      backdropDismiss: true
    });
    // await this.loadingController.getTop()
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }

  async hideLoader() {
    this.loadingController.dismiss();
  }

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
