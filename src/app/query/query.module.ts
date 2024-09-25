import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueryPageRoutingModule } from './query-routing.module';
import { SharedModule } from '../shared/shared.module'
import { QueryPage } from './query.page';
import { QueryformComponent } from '../query/queryform/queryform.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    QueryPageRoutingModule
  ],
  declarations: [QueryPage, QueryformComponent],
  entryComponents: [
    QueryformComponent
  ]
})
export class QueryPageModule {}
