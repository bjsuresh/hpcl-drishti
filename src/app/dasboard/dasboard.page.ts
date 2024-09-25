import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesService } from '../pages/pages.service'
import { EMPTY, Subscription, interval, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { catchError, mergeMap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { uid } from 'uid';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.page.html',
  styleUrls: ['./dasboard.page.scss'],
})
export class DasboardPage implements OnInit {

  header: string;
  pageData = []
  userName: any;
  imei: any;
  role: any;
  //superadmin = S
  //admin = A
  //power = P
  //simple = U
  licenseData: any;
  session_tooltip: any;
  Expiry_time: any;
  logState: any;

  constructor(private router: Router, private aroute: ActivatedRoute, private menu: MenuController, private commonService: CommonService, private pageService: PagesService, private loginService: LoginService    ) { }

  ngAfterViewInit() {

  }

  navToSettings() {
    this.router.navigate(['./profile/settings'])
  }
  
  ngOnInit() {
    console.log("dashboard init");
    if(localStorage.getItem('data')) {
      this.pageData = JSON.parse(localStorage.getItem('data'))
    }
    
    this.userName = localStorage.getItem('userName')
    this.imei = localStorage.getItem('imei')
    this.role = localStorage.getItem('AdminType')


  }

  ionViewDidEnter() {
    this.pageService.GetAppLicense().subscribe((licenseData: any) => {
      this.licenseData = JSON.parse(licenseData)
      console.log('licenseData ------------>', licenseData,this.licenseData)
      localStorage.setItem('licenseData',licenseData)
    })

    if(localStorage.getItem('licenseData')){
      this.licenseData = JSON.parse(localStorage.getItem('licenseData'));
    }
    console.log('licenseData ->',this.licenseData)

    setInterval(() => {
      this.Expiry_time = localStorage.getItem('exp_time');
    }, 1000);

    this.session_tooltip = localStorage.getItem('auto_log');
    console.log('session_tooltip',this.session_tooltip);

    this.logState = localStorage.getItem('login_state');

    console.log('logState',this.logState);

    if(this.logState == 'true'){
      const timestamp = localStorage.getItem('expires');
      const date:any = new Date(timestamp);
      this.expirationTime = Math.floor(date / 1000);

      // const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      // const oneMinute = 30; // 60 seconds in one minute
      // this.expirationTime = currentTimestamp + oneMinute;
  
      console.log('expirationTime',this.expirationTime);
  
      this.calculateRemainingTime();  
      // this.startTimer();
      this.timerSubscription = interval(1000).subscribe(() => {
        this.calculateRemainingTime();
      });
    }

  }

  setHeader(value) {
    this.header = value;
    // this.router.navigateByUrl('dashboard/pages')
    // this.menu.close()
  }

  selectMenu(data) {
    this.header = data.pagename
    this.router.navigate(['dashboard', data.pagename])
    this.menu.close()
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('GroupId')
    localStorage.removeItem('UserId')
    localStorage.removeItem('query')
    localStorage.removeItem('imei')

    localStorage.removeItem('expires_in')
    localStorage.removeItem('expires')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('login_state');

    localStorage.setItem('login_state', 'false');

    // localStorage.removeItem('userName')
    if(localStorage.getItem('remberMe') == 'false') {
      localStorage.removeItem('password')
      localStorage.removeItem('remberMe')
      localStorage.removeItem('userName')
    }
    this.router.navigateByUrl('login')
  }

  ionTabsDidChange(event) {
    console.log("event", event)
    this.header = event.tab
  }

  ionViewDidLeave() {
    console.log('ionic view did leave')
    this.menu.close()
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("destroyed");
    }
  }

  navigateUrl() {
    this.router.navigate(['./profile/changepassword'])
  }

  expirationTime: number; // Store the expiration time as a timestamp
  remainingTime: number; // Store the remaining time in seconds
  timer: any;
  formattedTime: string;
  private timerSubscription: Subscription;

  // Add this function to start the timer
  startTimer() {
    this.timer = setInterval(() => {
      this.calculateRemainingTime();
    }, 1000);
  }

  // Add this function to clear the timer
  clearTimer() {
    clearInterval(this.timer);
  }
  
 ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("destroyed");
    }
  }


  calculateRemainingTime() {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    // console.log("currentTime",currentTime);

    this.remainingTime = Math.max(0, this.expirationTime - currentTime); // Remaining time in seconds
    console.log("remainingTime",this.remainingTime);

    if (this.remainingTime === 0) {
      // Handle the expiration, e.g., log the user out
      console.log('Token has expired');
      if(this.session_tooltip == 'true'){
        // var reftoken = 'd1c7bd1e-deca-447f-9d23-837de4dafa8e';
        var reftoken = localStorage.getItem('refresh_token');
        // if (this.timerSubscription) {
        //   this.timerSubscription.unsubscribe();
        // }
        this.loginService.regenerateToken(reftoken)
        .subscribe(res=>{
          console.log("response new -", res);
  
          localStorage.setItem('token', res['access_token']);
          localStorage.setItem('expires_in',res['expires_in']);
          localStorage.setItem('expires',res['.expires']);
          localStorage.setItem('refresh_token', res['refresh_token']);
  
          // Unsubscribe from the current timer
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
         
        },           
      (error) => {
        // Handle the error here
        // if (error.status === 400) {
          console.log("refToken err",error)
          // Perform the token resend logic here
          // For instance:
          // this.loginService.sendToken();
          var encryptUser = localStorage.getItem('encryptUser');
          var encodedEncryptPassword = localStorage.getItem('encodedEncryptPassword');
          var encryptCheckUser = localStorage.getItem('encryptCheckUser');
          var encryptCheckPassword = localStorage.getItem('encryptCheckPassword');
          var grant_type = localStorage.getItem('grant_type');
          var imei = localStorage.getItem('imei');
          
          var userName = localStorage.getItem('userName');
          var password = localStorage.getItem('password');
          // var password = localStorage.getItem('password') + specialString + uniqueId;

          var decryptUser = CryptoJS.AES.decrypt(userName, key,
            {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
            // decryptUser = encodeURIComponent(decryptUser);
            console.log('decryptUser',decryptUser);
        
            var decryptPassword = CryptoJS.AES.decrypt(password, key,
              {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
              console.log('decryptPassword',decryptPassword);
        

          var key = CryptoJS.enc.Utf8.parse("PyNmDKjdFXchIFhxEv0VOf2b968ZbVSb");
          console.log(key);
          var specialString = "~!@#";
          var uniqueId = uid(8);
          var i_v = CryptoJS.enc.Utf8.parse('I8zyA4lVhMCaJ5Kg');
          console.log("iv",i_v);

          var encryptUser = CryptoJS.AES.encrypt(userName, key,
            {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
            encryptUser = encodeURIComponent(encryptUser);
            console.log('encryptUser',encryptUser);
        
            var encryptPassword = CryptoJS.AES.encrypt(password, key,
              {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
        
              // encryptPassword = encryptPassword.replace(/\s/g, '');
              var encodedEncryptPassword = encodeURIComponent(encryptPassword);
              console.log('encodedEncryptPassword', encodedEncryptPassword);      
              console.log('encryptPassword',encryptPassword);

          this.loginService.tokenLogin(grant_type,userName,password).subscribe((resFormApi) => {
            console.log('res',resFormApi);
            console.log("token refsuccessfully");
          
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

          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
        // }
   
      })  
      }
      else {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
          console.log("destroyed");
        }
      }

      const timestamp = localStorage.getItem('expires');
      const date:any = new Date(timestamp);
      this.expirationTime = Math.floor(date / 1000);

      // const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      // const oneMinute = 30; // 60 seconds in one minute
      // this.expirationTime = currentTimestamp + oneMinute;

      // Start a new timer
      this.timerSubscription = interval(1000).subscribe(() => {
        this.calculateRemainingTime();
      });

      // this.clearTimer();
      // this.startTimer();
      
    }
    else {
      console.log('Token has valid');
    }

    this.formattedTime = this.formatTime(this.remainingTime);
    localStorage.setItem('exp_time',this.formattedTime);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;
    return `${minutes} mins : ${secondsPart < 10 ? '0' : ''}${secondsPart} secs`;
  }

 }
