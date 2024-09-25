import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { CommonService } from './common.service';
import { AddpageComponent } from './addpage/addpage.component'
import { PopoverComponent } from './popover/popover.component';
import { PopoverController } from '@ionic/angular';
import { ControlformComponent } from './controlform/controlform.component'
import { GridformComponent } from './gridform/gridform.component'
import { IndicatorformComponent } from './indicatorform/indicatorform.component'
import { BargaugeformComponent } from './bargaugeform/bargaugeform.component'
import { CirculargaugeformComponent } from './circulargaugeform/circulargaugeform.component'
import { LineargaugeformComponent } from './lineargaugeform/lineargaugeform.component'
import { PagesaveformComponent } from './pagesaveform/pagesaveform.component'
import { SharedModule } from './shared/shared.module'
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ViewcontrolsComponent } from './viewcontrols/viewcontrols.component';
import { SingleViewControlComponent } from './single-view-control/single-view-control.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Device } from '@ionic-native/device/ngx';
import { TokenService } from './auth/token.service'
import { ColorPickerModule } from 'ngx-color-picker';
import { TagSelectComponent } from './tag-select/tag-select.component'
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'


@NgModule({
  declarations: [SingleViewControlComponent, AppComponent,ViewcontrolsComponent,AddpageComponent,PopoverComponent,ControlformComponent,GridformComponent,BargaugeformComponent,CirculargaugeformComponent,LineargaugeformComponent, PagesaveformComponent, IndicatorformComponent, TagSelectComponent],
  entryComponents: [SingleViewControlComponent, PopoverComponent,AddpageComponent,ControlformComponent,GridformComponent,BargaugeformComponent,CirculargaugeformComponent,LineargaugeformComponent,PagesaveformComponent,ViewcontrolsComponent, IndicatorformComponent, TagSelectComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ColorPickerModule,
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    FileTransfer,
    FileOpener,
    //SplashScreen,
    WebView,
    File,
    Uid,
    Sim,  
    AndroidPermissions,
    ScreenOrientation,
    Device,
    CommonService,
    PopoverController,
    {provide: HTTP_INTERCEPTORS, useClass: TokenService, multi:true},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
