import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChartsComponent } from '../charts/charts.component'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  constructor(public modalController: ModalController, private screenOrientation: ScreenOrientation) { }

  ngOnInit() {}

  async openCharts() {
    console.log("modal")
    const modal = await this.modalController.create({
      component: ChartsComponent
    });
    modal.onDidDismiss().then(data => {
      console.log("dissmiss")
      this.screenOrientation.unlock()
    })
    return await modal.present();
   
  }

}
