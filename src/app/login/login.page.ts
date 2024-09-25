import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingurlComponent } from './settingurl/settingurl.component'
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ToastController } from '@ionic/angular';
import { Sim } from '@ionic-native/sim/ngx';
import { LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { uid } from 'uid';
import { PagesService } from '../pages/pages.service';
import { EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading: any;
  simCardDetials: any
  remberMe;
  titleUrl: any;
  GetVendor1Url: any;
  GetVendor2Url: any;
  settingUrl: any;

  auto_log: any;
  login_state: any;

  constructor(private device: Device, private uid: Uid, private androidPermissions: AndroidPermissions, public loadingController: LoadingController, private sim: Sim, public toastController: ToastController, public modalController: ModalController, private route: Router, private fb: FormBuilder, private loginService: LoginService, private pageService: PagesService,
    private encryptionService: EncryptionService) {
  }

  ngAfterViewInit() {
    if (localStorage.getItem('remberMe') == 'true') {
      this.loginForm.get('userName').patchValue(localStorage.getItem('userName'))
      this.loginForm.get('password').patchValue(localStorage.getItem('password'))
      this.remberMe = true
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      // imei: ['', Validators.required]
    })
    
    console.log('Device UUID is: ' + this.device.uuid);
    this.settingUrl = "http://115.244.177.254:1224";
    
    console.log("setting url", this.settingUrl)

    environment.ipPort = this.settingUrl
    environment.apiUrl = this.settingUrl + '/api/'
    // environment.utc = this.utc
    localStorage.setItem('apiUrl', this.settingUrl)

    if (localStorage.getItem('apiUrl')) {
      environment.apiUrl = localStorage.getItem('apiUrl') + '/api/'
      environment.ipPort = localStorage.getItem('apiUrl')
      this.titleUrl = localStorage.getItem('apiUrl') + '/apis/GetTitle'
      this.GetVendor1Url = localStorage.getItem('apiUrl') + '/apis/GetVendor1'
      this.GetVendor2Url = localStorage.getItem('apiUrl') + '/apis/GetVendor2'
    }
    this.auto_log = localStorage.getItem('auto_log');
    this.login_state = localStorage.getItem('login_state');

    console.log("auto_log",this.auto_log, this.login_state);
    // console.log('model UUID is: ' + this.device.model);
    // console.log('platform UUID is: ' + this.device.platform);
    // console.log('cordova UUID is: ' + this.device.cordova);
    // console.log('version UUID is: ' + this.device.version);    
    // console.log('manufacturer UUID is: ' + this.device.manufacturer);
    // console.log('isVirtual UUID is: ' + this.device.isVirtual);
    // console.log('serial UUID is: ' + this.device.serial);

    this.sim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );

    this.sim.requestReadPermission().then(
      () => {
        this.getSimInfo()
        console.log('Permission granted')
      },
      () => console.log('Permission denied')
    );

    this.getImei().then(value => {
      console.log("-----------------", this.uid);
    }).catch(err => {
      console.log("error ----", err)
    })
  }


  hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
  }

  getSimInfo() {
    this.sim.getSimInfo().then(
      (info) => {
        console.log('Sim info: ', info)
        this.simCardDetials = info.cards
      },
      (err) => console.log('Unable to get sim info: ', err)
    );
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
    } else {
      console.log("login value", this.loginForm.value)
      let postData = this.loginForm.value
      await this.presentLoading()
      this.afterLoginAuth(postData)
    }
  }    
   

  afterLoginAuth(data) {
    var grant_type = data['grant_type'] = 'password';

    var key = CryptoJS.enc.Utf8.parse("PyNmDKjdFXchIFhxEv0VOf2b968ZbVSb");
    console.log(key);
    var specialString = "~!@#";
    var uniqueId = uid(8);
    // var uniqueId = uuidv4();
    console.log("uniqueId",uniqueId,"d",data);
    
    var user = data['userName'] ;
    var password = data['password'] + specialString + uniqueId;
    var checkpassword = data['password'];

    var i_v = CryptoJS.enc.Utf8.parse('I8zyA4lVhMCaJ5Kg');
    console.log("iv",i_v);

    var encryptUser = CryptoJS.AES.encrypt(user, key,
    {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
    encryptUser = encodeURIComponent(encryptUser);
    console.log('encryptUser',encryptUser);

    var encryptPassword = CryptoJS.AES.encrypt(password, key,
      {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();

      // encryptPassword = encryptPassword.replace(/\s/g, '');
      var encodedEncryptPassword = encodeURIComponent(encryptPassword);
      console.log('encodedEncryptPassword', encodedEncryptPassword);      
      console.log('encryptPassword',encryptPassword);

    var encryptCheckPassword = CryptoJS.AES.encrypt(checkpassword, key,
      {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();

      localStorage.setItem('grant_type', grant_type)
      localStorage.setItem('encryptUser', encryptUser)
      localStorage.setItem('encodedEncryptPassword', encodedEncryptPassword)
  
    this.loginService.tokenLogin(grant_type,encryptUser,encodedEncryptPassword).subscribe((resFormApi) => {
    console.log('res',resFormApi);
    
    if (resFormApi['Identity']) {

      var Id = resFormApi['Identity'];

      var decryptId = CryptoJS.AES.decrypt(Id, key,{  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString(CryptoJS.enc.Utf8);

      var verify_uniqueID = decryptId.slice(0, 8);
      
      if ((resFormApi['access_token']) && (uniqueId == verify_uniqueID)) {

        console.log("login successfully",verify_uniqueID);
  
        localStorage.setItem('token', resFormApi['access_token']);
        localStorage.setItem('expires_in',resFormApi['expires_in']);
        localStorage.setItem('expires',resFormApi['.expires']);
        localStorage.setItem('refresh_token', resFormApi['refresh_token']);


        // data['imei'] = this.device.uuid
        // var imei = data['imei'] = '902738515d1d9b06';

        if(this.device.uuid){
          var imei = data['imei'] = this.device.uuid;
        }
        else{
          var imei = data['imei'] = '902738515d1d9b06';
        }

        // encryptUser = decodeURIComponent(encryptUser);
        console.log('encryptUser',encryptUser);

        // const networkPayload = encryptUser;
        // const decryptedPayload = decodeURIComponent(encryptUser);
        // console.log('decryptedPayload',decryptedPayload);
        // var encryptCheckUser = encodeURIComponent(encryptUser);

        var encryptCheckUser = CryptoJS.AES.encrypt(user, key,
          {  mode: CryptoJS.mode.CBC ,iv:i_v , keySize:256/8 }).toString();
        console.log('encryptCheckUser',encryptCheckUser);

      localStorage.setItem('encryptCheckUser', encryptCheckUser)
      localStorage.setItem('encryptCheckPassword', encryptCheckPassword)

        this.loginService.login( encryptCheckUser,encryptCheckPassword,imei).subscribe((resFormApi: string) => {
          this.loading.dismiss();
          console.log("response", JSON.parse(resFormApi))
          let response = JSON.parse(resFormApi)
          if (response.LogInStatus == "Success") {
            localStorage.setItem('GroupId', response.GroupId)
            localStorage.setItem('UserId', response.UserId)
            localStorage.setItem('apiUrl', environment.ipPort)
            localStorage.setItem('userName', this.loginForm.get('userName').value)
            localStorage.setItem('imei', imei)
            localStorage.setItem('AdminType', response.AdminType)
            localStorage.setItem('remberMe', this.remberMe)
            localStorage.setItem('login_state', 'true');
            localStorage.setItem('password', this.loginForm.get('password').value)
            // localStorage.setItem('auto_log', 'false');
            if (this.remberMe) {
              localStorage.setItem('password', this.loginForm.get('password').value)
            }
            this.route.navigateByUrl('dashboard/viewpages');

            const encryptedPassword = this.encryptionService.encrypt(data['password']);
            localStorage.setItem('encryptedPassword', encryptedPassword)
            console.log("Func Encrypted Password:", encryptedPassword);
            

          } else {
            this.presentToast(response['LogInStatus'])
            this.loading.dismiss()
          }
        }, (err) => {
          console.log(err)
          this.loading.dismiss()
          this.presentToast('Unable to reach server! Please verify the SAMA MP URL and contact Administrator.')
        })
      }
      
    } else {
      this.loading.dismiss()
      this.presentToast(resFormApi['error_description'])
    }
  }, (err) => {
    console.log(err)
    this.loading.dismiss()
    this.presentToast('Unable to reach server! Please verify the SAMA MP URL and contact Administrator.')
  })
}
  
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SettingurlComponent,
      cssClass: 'addsetingurlmodal'
    });
    modal.onWillDismiss()
    .then(obj => {
      if(obj.data == 'save') {
        this.titleUrl = localStorage.getItem('apiUrl') + '/apis/GetTitle'
        this.GetVendor1Url = localStorage.getItem('apiUrl') + '/apis/GetVendor1'
        this.GetVendor2Url = localStorage.getItem('apiUrl') + '/apis/GetVendor2'
      }
    })    
    return await modal.present();
  }

  setting() {
    this.presentModal()
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait... Trying to reach Server',
      // duration: 2000
    });
    await this.loading.present();
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );

      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }

      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }
  }

  ionViewWillLeave() {
    console.log("call (Viewpages) ng init");
    this.getAllPageApi();

    // if (localStorage.getItem('data')) {
    //   this.pageData = JSON.parse(localStorage.getItem('data'))
    // }
  }

  getAllPageApi() {
    console.log('getAllPageApi')
    this.presentLoading();
    this.pageService.getAllPage().subscribe((data: any) => {
      console.log("getAllPage data", JSON.parse(data))
      this.loading.dismiss();
      localStorage.setItem('data',data);
    })
  }

}
