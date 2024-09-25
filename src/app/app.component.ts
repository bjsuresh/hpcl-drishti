import { Component, OnInit } from '@angular/core';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from './auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login/login.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
 
  logState: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    public toastController: ToastController,
    // private appVersionService: AppVersion
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.splashScreen.show();
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#223598')
    // this.splashScreen.hide();
    });
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    // );
    
    // this.platform.resume.subscribe((data) => {
    //   this.authService.logout()
    //   this.router.navigateByUrl('login')
    // })
    // this.platform.pause.subscribe((data) => {
    //   this.authService.logout()
    //   this.router.navigateByUrl('login')
    // })
    
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]);
  }



  ngOnInit(): void {
    
  }
  
  getAppVersion() {
        // this.appVersionService.getVersionNumber().then((version: string) => {
        //   console.log('App version:', version);
        //   // alert(version);
        //   this.appVersion = version;
        // });
        // if(this.appVersion >= '0.0.10'){
        //   alert(this.appVersion);
        // }
      }

}
