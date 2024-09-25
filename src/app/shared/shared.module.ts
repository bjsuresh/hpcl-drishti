import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DxDataGridModule, DxBarGaugeModule, DxLinearGaugeModule, 
  DxButtonModule, DxChartModule, DxSelectBoxModule, DxTreeViewModule,
  DxCircularGaugeModule, DxTreeListModule, DxListModule
} from 'devextreme-angular';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DxChartModule,
    DxCircularGaugeModule,
    DxDataGridModule,
    DxBarGaugeModule,
    DxLinearGaugeModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxButtonModule,
    IonicModule,
    DxTreeViewModule,
    DxListModule,
    DxTreeListModule,
    FormsModule
  ],
  exports: [
    DxChartModule,
    DxCircularGaugeModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxBarGaugeModule,
    DxLinearGaugeModule,
    ReactiveFormsModule,
    DxButtonModule,
    IonicModule,
    DxTreeViewModule,
    DxTreeListModule,
    DxListModule,
    FormsModule
  ]
})
export class SharedModule { }
