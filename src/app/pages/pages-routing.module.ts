import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesPage } from './pages.page';
import { LayoutComponent } from './layout/layout.component'

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },
  {
    path: ':pagename',
    component: LayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
