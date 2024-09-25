import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddpageComponent } from './addpage/addpage.component';
import { ControlformComponent } from './controlform/controlform.component'
import { AuthGuardService as AuthGuard  } from './auth/auth-guard.service';
import { LoginGuardService as LoginGuard  } from './auth/login-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'dashboard',
    //component: ControlformComponent
    loadChildren: () => import('./dasboard/dasboard.module').then( m => m.DasboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'query',
    loadChildren: () => import('./query/query.module').then( m => m.QueryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfileModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
