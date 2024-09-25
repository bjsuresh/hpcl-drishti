import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SettingurlComponent }from './settingurl/settingurl.component';
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedModule
  ],
  declarations: [LoginPage, SettingurlComponent],
  entryComponents: [SettingurlComponent]
})
export class LoginPageModule {}
