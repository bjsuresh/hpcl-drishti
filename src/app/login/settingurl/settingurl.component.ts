import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModalController, } from '@ionic/angular';

@Component({
  selector: 'app-settingurl',
  templateUrl: './settingurl.component.html',
  styleUrls: ['./settingurl.component.scss'],
})
export class SettingurlComponent implements OnInit {

  settingUrl: any
  utc;
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    if(localStorage.getItem('apiUrl')) {
      this.settingUrl = localStorage.getItem('apiUrl')
      environment.apiUrl = this.settingUrl + '/api/'
    } else {
      this.settingUrl = environment.ipPort
    }
    if(localStorage.getItem('utc')) {
      this.utc = localStorage.getItem('utc')
      environment.apiUrl = this.utc
    } else {
      this.utc = environment.utc
    }
  }

  save() {
    console.log("setting url", this.settingUrl)
    environment.ipPort = this.settingUrl
    environment.apiUrl = this.settingUrl + '/api/'
    environment.utc = this.utc
    localStorage.setItem('apiUrl', this.settingUrl)
    localStorage.setItem('utc', this.utc)
    this.modalController.dismiss('save')
  }

}
