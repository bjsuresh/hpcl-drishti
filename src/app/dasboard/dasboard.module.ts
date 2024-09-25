import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DasboardPageRoutingModule } from './dasboard-routing.module';

import { DasboardPage } from './dasboard.page';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';
import { ViewpageComponent } from '../viewpage/viewpage.component';
import { ViewgraphicsComponent } from '../viewgraphics/viewgraphics.component';
import { ReportComponent } from '../report/report.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DasboardPageRoutingModule,
  ],
  declarations: [DasboardPage, MainPageComponent, ReportComponent, ViewpageComponent, ViewgraphicsComponent]
})
export class DasboardPageModule {}
