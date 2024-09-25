import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { SettingsPageComponent } from './settings-page/settings-page.component'

const routes: Routes = [{
  path: 'changepassword',
  component: ChangePasswordComponent,
},{
    path: 'settings',
    component: SettingsPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
