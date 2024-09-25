import { Component, OnInit, ViewChild, Renderer2, ElementRef, Input} from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
//import { PopoverComponent } from '../popover/popover.component';
import { AlertController } from '@ionic/angular';
import { ControlformComponent } from '../controlform/controlform.component';
import { GridformComponent } from '../gridform/gridform.component';
import { IndicatorformComponent } from '../indicatorform/indicatorform.component';
import { BargaugeformComponent } from '../bargaugeform/bargaugeform.component';
import { CirculargaugeformComponent } from '../circulargaugeform/circulargaugeform.component';
import { LineargaugeformComponent } from '../lineargaugeform/lineargaugeform.component';
import { PagesService } from '../pages/pages.service'
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.scss'],
})


export class AddpageComponent implements OnInit {

  @ViewChild('body', { static: true }) body: ElementRef;
  @ViewChild('barChart', { static: true }) barChart: any;
  @Input() id: any;
  bars: any;
  colorArray: any;
  customers: any
  dataJson = [];
  tagsData = []
  pageData: any
  controlProperties: any= {};
  dataObj = {}
  populationData;
  dataSource;
  products;
  editId: any;
  editIndex: any;
  editData: any;
  aggerateData: any
  gridfields = ["Name", "Value", "TimeStamp", "Description", "Quality"];
  indicatorfields = ["Alias Name", "Tag Name", "Condition"];
  indicatorData =  [{
    id:1,
    "aliasName" : 'Room1',
    "tagName" : 'TEAPLANT-002',
    "color": "red",
     parentId: -1
  }, {
      id: 2,
      "aliasName" : 'Room1',
      "tagName" : 'TEAPLANT-002',
      "color": "red",
      parentId: 1
    }
  ]
  indicatorSource = [{
    "Alias Name" : 'Room1',
    "Tag Name" : 'TEAPLANT-002',
    'Condition': '100 < 200'
  }]
  header: string;
  constructor(public toastController: ToastController, private pageService: PagesService, private router: Router, private aroute: ActivatedRoute, public modalController: ModalController, public popoverController: PopoverController, private render: Renderer2,public alertController: AlertController) { }

  ngOnInit() {
    //this.initLoad()
  }

  initLoad() {
    this.pageService.getByIdPageDetails(this.id).subscribe((data: any) => {
      this.controlProperties = JSON.parse(data)
      if(this.controlProperties['pageproperties'] == 'undefined' || this.controlProperties['pageproperties'] == null || this.controlProperties['pageproperties'] == '') {
        console.log("-----------------------------")
        this.controlProperties['pageproperties'] = []
      } else {
        this.controlProperties['pageproperties'] = JSON.parse(this.controlProperties['pageproperties'])
      }      
      console.log("get by id page data", this.controlProperties);
    })
    // this.pageService.GetTags().subscribe((data: any) => {
    //   this.tagsData = JSON.parse(data);
    //   console.log("get all tags", this.tagsData);
    // })
    this.pageService.GetAggreates().subscribe((data: any) => {
      this.aggerateData = [];
      console.log("get all operations", this.aggerateData);
    })
    this.dataSource = [{
      day: "2020-03-20 10:00:00",
      oranges: 400
    }, {
      day: "2020-03-20 11:00:00",
      oranges: 240
    }, {
      day: "2020-03-20 12:00:00",
      oranges: 300
    }, {
      day: "2020-03-20 13:00:00",
      oranges: 380
    }, {
      day: "2020-03-20 14:00:00",
      oranges: 640
    }, {
      day: "2020-03-20 15:00:00",
      oranges: 1100
    }, {
      day: "2020-03-20 16:00:00",
      oranges: 890
    }];
  }

  ionViewDidEnter() {
    this.initLoad()
  }

  doRefresh(event) {
    this.initLoad()
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  
  async dismissModal() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to Close?!',
      message: 'All progress in this session will be lost',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'          
        }, {
          text: 'Close',  
          role: 'submit',
          cssClass: 'primary'          
        }
      ]      
    });

    alert.onDidDismiss().then((submitData) => {
      if (submitData.role == 'submit') {
        this.modalController.dismiss('',  'cancel')
      }
    })

    await alert.present();
  }

  /*createBarChart(id: string) {
    let name = document.getElementById(id)
    new Chart(name, {
      type: 'bar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'Viewers in millions',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }*/

  /*createLineChart(id: any) {
    new Chart(id, {
      type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'My First dataset',
              data: [
                40,
                30,
                20,
                89,
                70,
                71,
                34
              ],
              fill: false,
            }]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: 'Chart.js Line Chart'
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              x: {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Month'
                }
              },
              y: {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value'
                }
              }
            }
          }
      //options: options
    });
  }*/

  async addLayout(value: string, data?: object) {
    let obj = {}
    obj['id'] = Math.random().toString()
    obj['type'] = value
    this.controlProperties['pageproperties'].push(obj)
    console.log("id chart", this.controlProperties)
    /*if(value === 'chart') {
      let id;
      if(data) {
        id = data;
      } else {
        id = await this.createCardandCanvas()
        id['type'] = 'bar'
      }
      setTimeout(() => {
        console.log("document id", document.getElementById(id['cardid']))
        this.render.appendChild(document.getElementById(id['cardid']), id['canvas'])
        console.log("chart type", id)
        if(id['type'] === 'bar') {
          console.log("inside bar chart")
          this.createBarChart(id['chartid'])
        } else if(id['type'] === 'line') {
          console.log("inside line chart")
          this.createLineChart(id['chartid'])
        }
      })
    }*/
  }

  /* deleteComp(index: number) {
     console.log("call delete function")
     this.dataJson.splice(index, 1)
   }
 
   createCardandCanvas() {
     return new Promise((resolve, reject) => {
       let id = {}
       id['canvas'] = this.render.createElement('canvas')
       id['cardid'] = Math.random() + 'card'
       id['chartid'] = id['cardid'] + 'chart'
       this.dataJson.push(id)
       //console.log("++++++++++++++")
       //console.log("data json", this.dataJson)
       this.render.setProperty(id['canvas'], 'id', id['chartid']);
       this.render.setAttribute(id['canvas'], 'width', '200px');
       this.render.setAttribute(id['canvas'], 'height', '200px');
       resolve(id)
     })
   }
 
   async presentPopover(ev: any, data: object) {
     const popover = await this.popoverController.create({
       component: PopoverComponent,
       event: ev,
       translucent: true,
       cssClass: 'chartmenu',
       componentProps: ['Line Chart', 'Bar Chat'],
     });
     popover.onWillDismiss()
     .then(value => {
       console.log("value", value)
       data['type'] = value.data;
       this.addLayout('chart', data)
     })
     return await popover.present()
   }*/

   setHeader(value) {
    this.header = value;
  }

  async openControlForm(id, index) {
    const modal = await this.modalController.create({
      component: ControlformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
        aggerateData: this.aggerateData
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("dismiss data", submitData)
      if (submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  async openGridControlForm(id, index) {
    const modal = await this.modalController.create({
      component: GridformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
        aggerateData: this.aggerateData
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      if (submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  async openIndicatorControlForm(id, index) {
    const modal = await this.modalController.create({
      component: IndicatorformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      if (submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  async openBargaugeControlForm(id, index) {
    const modal = await this.modalController.create({
      component: BargaugeformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
      }
    });
    modal.onDidDismiss().then((submitData) => {
      if (submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  async openCirculargaugeControlForm(id, index) {
    const modal = await this.modalController.create({
      component: CirculargaugeformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
      }
    });
    modal.onDidDismiss().then((submitData) => {
      if (submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  async openLineargaugeControlForm(id, index) {
    const modal = await this.modalController.create({
      component: LineargaugeformComponent,
      componentProps: {
        data: this.controlProperties['pageproperties'][index].data ? this.controlProperties['pageproperties'][index].data : '',
      }
    });
    modal.onDidDismiss().then((submitData) => {
      if(submitData.role == 'submit') {
        this.controlProperties['pageproperties'][index]['data'] = submitData.data
      }
    })
    return await modal.present();
  }

  deleteControlForm(index) {
    this.controlProperties['pageproperties'].splice(index, 1)
  }

  async deleteControlConfirmForm(index) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure want to delete this control?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'          
        }, {
          text: 'OK',  
          role: 'submit',
          cssClass: 'primary'          
        }
      ]      
    });

    alert.onDidDismiss().then((submitData) => {
      if (submitData.role == 'submit') {
       this.deleteControlForm(index);
      }
    })

    await alert.present();
  }


  async openPagesaveForm() {
    console.log("page data", this.dataJson);
  }

  update() {
    console.log("paga data", this.controlProperties)
    let postData = JSON.parse(JSON.stringify(this.controlProperties))
    postData['pageproperties'] = JSON.stringify(postData['pageproperties'])
    this.pageService.updatePageProperties(postData).subscribe(resFormApi => {
      console.log("resFormApi", resFormApi)
      if(resFormApi) {
        this.presentToast('Successfully Updated')
        this.modalController.dismiss('submit')
      }
    })
  }

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  // ionViewWillLeave(){
  //   this.pageLeaveConfrim()
  // }

  // async pageLeaveConfrim() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirm!',
  //     message: 'Message <strong>text</strong>!!!',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Okay',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }
}
