import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagesPageRoutingModule } from './pages-routing.module';
import { PagesPage } from './pages.page';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesService } from './pages.service';
import { LayoutComponent } from './layout/layout.component'
import { ChartsComponent } from './charts/charts.component'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagesPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [PagesPage, LayoutComponent, ChartsComponent],
  entryComponents: [ChartsComponent],
  providers: [
    PagesService,
  ]
})
export class PagesPageModule {}
