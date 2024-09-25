import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

import { UserPage } from './user.page';
import { UserformComponent } from './userform/userform.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    SharedModule
  ],
  declarations: [
    UserPage,
    UserformComponent
  ]
})
export class UserPageModule {}
