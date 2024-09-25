import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileService } from './profile.service'
import { MustmatchDirective } from '../_helpers/mustmatch.directive';
import { SettingsPageComponent } from './settings-page/settings-page.component';
@NgModule({
  declarations: [ChangePasswordComponent, SettingsPageComponent, MustmatchDirective],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
