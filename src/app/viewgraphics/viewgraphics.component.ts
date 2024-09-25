import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesaveformComponent } from '../pagesaveform/pagesaveform.component';
import { PagesService } from '../pages/pages.service';
import { ViewcontrolsComponent } from '../viewcontrols/viewcontrols.component';
import { v4 as uuidv4 } from 'uuid'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { environment } from '../../environments/environment'
import { ToastController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-viewgraphics',
  templateUrl: './viewgraphics.component.html',
  styleUrls: ['./viewgraphics.component.scss'],
})
export class ViewgraphicsComponent implements OnInit {
  pageData = []
  enterpriseData = []
  siteData = []
  unitData = []
  plantData = []
  areaData = []
  nav: any;
  treeData = []
  graphicsUrl = 'http://115.244.177.254:1223';
  pageList= [];
  userName: any;
  password: any;

  public segment: string = "hierarchical_type";

  constructor(public toastController: ToastController, private iab: InAppBrowser,private platform: Platform, public modalController: ModalController, private router: Router, private aroute: ActivatedRoute, private pageService: PagesService, private screenOrientation: ScreenOrientation, private loadingController: LoadingController) { }

  ngOnInit() {
    // this.getAllPageApi()
  }

  setEmptyValue() {
    this.pageData = []
    this.enterpriseData = []
    this.siteData = []
    this.unitData = []
    this.plantData = []
    this.areaData = []
    this.treeData = []
  }

  async getAllPageApi() {
    this.pageService.getAllPage().subscribe((data: any) => {
      console.log("getAllPage data", JSON.parse(data))
      this.setEmptyValue()
      this.pageData = JSON.parse(data).filter(obj => obj.PageType != 'M')
      console.log("pageData data", this.pageData)
      for (var i = 1; i <= 6; i++) {
        this.recurseData(i)
      }
      console.log(this.treeData)
      this.getPageItems();

      // this.dataStructCreate(JSON.parse(data))
      // data = JSON.parse(data)
      // data.forEach(ele => {
      //   let planObj = {
      //     id: ele.PlantId,
      //     name: ele.Plantname
      //   }
      //   let areaObj = {
      //     id: ele.AreaId,
      //     name: ele.AreaName
      //   }
      //   if (this.plantData.length == 0) {
      //     this.plantData.push(planObj)
      //   } else if (!this.plantData.find(planEle => planEle.id == ele.PlantId)) {
      //     this.plantData.push(planObj)
      //   }
      //   if (ele.AreaId != -1) {
      //     if (this.areaData.length == 0) {
      //       this.areaData.push(areaObj)
      //     } else if (!this.areaData.find(areaEle => areaEle.id == ele.AreaId)) {
      //       this.areaData.push(areaObj)
      //     }
      //   }
      // });
    })
  }

  isPlatformAndroid() {
    return this.platform.is('android');
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getPageItems() {
    this.pageList = this.treeData.filter((item) => item.level === 6);
    console.log("pageList",this.pageList);
  }

  async  selectPageItem(event) {
    if (event.itemData.level == 6 && this.graphicsUrl != '') {
      const target = this.isPlatformAndroid() ? '_self' : '_blank';
      console.log("platform",this.platform);
      // const loading = await this.loadingController.create({
      //   message: 'Loading...', // You can customize the message
      //   duration: 10000, // Set a maximum duration for the loading screen (in milliseconds)
      // });

      
      if(this.platform.is('ios')){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        .then(() => {
          const browser = this.iab.create(`${this.graphicsUrl}/Hist_GraphicsDisplay/GraphicsDisplay_external?username=${this.userName}&password=${this.password}&pageid=${event.itemData.id}&pagename=${event.itemData.text}`, target, {
            location: 'yes',
            hidden: 'no',
            zoom: 'yes', // Enable zooming on Android
            hideurlbar: 'yes',
            closebuttoncaption: 'Close', //iOS only
            disallowoverscroll: 'no', //iOS only 
            toolbar: 'yes', //iOS only 
            toolbarposition: 'top',
            enableViewportScale: 'no', //iOS only           
            toolbarcolor: '#223598',
            toolbartranslucent: "no",
            closebuttoncolor: '#ffffff',
            navigationbuttoncolor: '#223598',
            useWideViewPort: 'yes', // Enable wide viewport on Android
            hardwareback: 'yes',
            fullscreen: 'yes',
            footer: 'yes'
          });
  
          browser.insertCSS({
            code: "body{background-color: white;height:100%;background: white;}"
          });

          browser.on('loadstart').subscribe(event => {
            // loading.present();
          });
  
          browser.on('loadstop').subscribe(event => {
            browser.insertCSS({code: "body{background-color: white;height:100%;background: white;}"});
          });
  
          browser.on('exit').subscribe(() => {
            // this.screenOrientation.unlock();
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
                .then(() => console.log('Orientation set to portrait'))
                .catch(error => console.error('Failed to lock screen orientation:', error));
          });
          // loading.dismiss();
        })
        .catch(error => {
          // Handle any errors related to locking the screen orientation
          console.error('Failed to lock screen orientation:', error);
          // loading.dismiss();
        });
  
      }
      else{

          // Create and open the InAppBrowser with the desired URL
          const browser = this.iab.create(`${this.graphicsUrl}/Hist_GraphicsDisplay/GraphicsDisplay_external?username=${this.userName}&password=${this.password}&pageid=${event.itemData.id}&pagename=${event.itemData.text}`, target, {
            location: 'yes',
            hidden: 'no',
            enableviewportscale: 'yes',
            zoom: 'yes', // Enable zooming on Android
            hideurlbar: 'yes',
            toolbarcolor: '#223598',
            // closebuttoncolor: 'white',
            navigationbuttoncolor: '#223598',
            useWideViewPort: 'yes', // Enable wide viewport on Android
            hardwareback: 'yes',
            fullscreen: 'no',
            footer: 'yes'
          });
  
          browser.insertCSS({
            code: "body{background-color: white;height:100%;background: white;}"
          });
  
          browser.on('loadstart').subscribe(event => {
            browser.insertCSS({code: "body{background-color: white;height:100%;background: white;}"});
          });
          // loading.dismiss();
      }

    }

    if(this.graphicsUrl === '') {
      this.presentToast('Please fill the graphics url input in setting page')
    }
    // location.href = `http://122.165.186.71:1221/Hist_GraphicsDisplay/GraphicsDisplay_external?username=admin&password=rq38ugbyyiQqfODPGDolMA==&pageid=${event.itemData.id}&pagename=${event.itemData.text}`
    // this.webview.convertFileSrc(`http://122.165.186.71:1221/Hist_GraphicsDisplay/GraphicsDisplay_external?username=admin&password=rq38ugbyyiQqfODPGDolMA==&pageid=${event.itemData.id}&pagename=${event.itemData.text}`)

    // if(event.itemData.level == 6) {
    //   this.openControls(event.itemData.id)
    // }
  }

  recurseData(level) {
    this.pageData.forEach(data => {
      let obj = {}
      if (level == 1) {
        // console.log("-----", data.EnterpriseId != 0, data.SiteId == 0)
        if (data.EnterpriseId != 0 && data.SiteId == 0 && data.PlantId == 0 && data.AreaId == 0 && data.UnitId == 0 && data.PageId == 0) {
          obj['level'] = 1
          obj['text'] = data['EnterpriseName']
          obj['id'] = data['EnterpriseId']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['uuid'] = data['EnterpriseId'] + data['EnterpriseName']
          obj['items'] = []
          this.treeData.push(obj)
          this.enterpriseData.push({ id: data['EnterpriseId'], name: data['EnterpriseName'] })
        }
      } else if (level == 2) {
        if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId == 0 && data.AreaId == 0 && data.UnitId == 0 && data.PageId == 0) {
          obj['level'] = 2
          obj['text'] = data['SiteName']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['id'] = data['SiteId']
          obj['uuid'] = data['SiteId'] + data['SiteName']
          obj['parentId'] = data['EnterpriseId']
          obj['parentUuid'] = data['EnterpriseId'] + data['EnterpriseName']
          obj['items'] = []

          let enterObj = this.enterpriseData.find(enterp => enterp.id == data.EnterpriseId)
          if (!enterObj) {
            let obj1 = {}
            obj1['level'] = 1
            obj1['text'] = data['EnterpriseName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['EnterpriseId']
            obj1['uuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.enterpriseData.push({ id: data['EnterpriseId'], name: data['EnterpriseName'] })
          }

          this.treeData.push(obj)
          this.siteData.push({ id: data['SiteId'], name: data['SiteName'] })
        }
      } else if (level == 3) {
        if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId == 0 && data.UnitId == 0 && data.PageId == 0) {
          obj['level'] = 3
          obj['text'] = data['PlantName']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['id'] = data['PlantId']
          obj['uuid'] = data['PlantId'] + data['PlantName']
          obj['parentId'] = data['SiteId']
          obj['parentUuid'] = data['SiteId'] + data['SiteName']
          obj['items'] = []

          let enterObj = this.enterpriseData.find(enterp => enterp.id == data.EnterpriseId)
          if (!enterObj) {
            let obj1 = {}
            obj1['level'] = 1
            obj1['text'] = data['EnterpriseName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['EnterpriseId']
            obj1['uuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.enterpriseData.push({ id: data['EnterpriseId'], name: data['EnterpriseName'] })
          }
          let siteObj = this.siteData.find(enterp => enterp.id == data.SiteId)
          if (!siteObj) {
            let obj1 = {}
            obj1['level'] = 2
            obj1['text'] = data['SiteName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['SiteId']
            obj1['uuid'] = data['SiteId'] + data['SiteName']
            obj1['parentId'] = data['EnterpriseId']
            obj1['parentUuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.siteData.push({ id: data['SiteId'], name: data['SiteName'] })
          }

          this.treeData.push(obj)
          this.plantData.push({ id: data['PlantId'], name: data['PlantName'] })
        }
      } else if (level == 4) {
        if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId != 0 && data.UnitId == 0 && data.PageId == 0) {
          obj['level'] = 4
          obj['text'] = data['AreaName']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['id'] = data['AreaId']
          obj['uuid'] = data['AreaId'] + data['AreaName']
          obj['parentId'] = data['PlantId']
          obj['parentUuid'] = data['PlantId'] + data['PlantName']
          obj['items'] = []

          let enterObj = this.enterpriseData.find(enterp => enterp.id == data.EnterpriseId)
          if (!enterObj) {
            let obj1 = {}
            obj1['level'] = 1
            obj1['text'] = data['EnterpriseName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['EnterpriseId']
            obj1['uuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.enterpriseData.push({ id: data['EnterpriseId'], name: data['EnterpriseName'] })
          }
          let siteObj = this.siteData.find(enterp => enterp.id == data.SiteId)
          if (!siteObj) {
            let obj1 = {}
            obj1['level'] = 2
            obj1['text'] = data['SiteName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['SiteId']
            obj1['uuid'] = data['SiteId'] + data['SiteName']
            obj1['parentId'] = data['EnterpriseId']
            obj1['parentUuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.siteData.push({ id: data['SiteId'], name: data['SiteName'] })
          }
          let plantObj = this.plantData.find(enterp => enterp.id == data.PlantId)
          if (!plantObj) {
            let obj1 = {}
            obj1['level'] = 3
            obj1['text'] = data['PlantName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['PlantId']
            obj1['uuid'] = data['PlantId'] + data['PlantName']
            obj1['parentId'] = data['SiteId']
            obj1['parentUuid'] = data['SiteId'] + data['SiteName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.plantData.push({ id: data['PlantId'], name: data['PlantName'] })
          }

          this.treeData.push(obj)
          this.areaData.push({ id: data['AreaId'], name: data['AreaName'] })
        }
      } else if (level == 5) {
        if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId != 0 && data.UnitId != 0 && data.PageId == 0) {
          obj['level'] = 5
          obj['text'] = data['UnitName']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['id'] = data['UnitId']
          obj['uuid'] = data['UnitId'] + data['UnitName']
          obj['parentId'] = data['AreaId']
          obj['parentUuid'] = data['AreaId'] + data['AreaName']
          obj['items'] = []

          let enterObj = this.enterpriseData.find(enterp => enterp.id == data.EnterpriseId)
          if (!enterObj) {
            let obj1 = {}
            obj1['level'] = 1
            obj1['text'] = data['EnterpriseName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['EnterpriseId']
            obj1['uuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.enterpriseData.push({ id: data['EnterpriseId'], name: data['EnterpriseName'] })
          }
          let siteObj = this.siteData.find(enterp => enterp.id == data.SiteId)
          if (!siteObj) {
            let obj1 = {}
            obj1['level'] = 2
            obj1['text'] = data['SiteName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['SiteId']
            obj1['uuid'] = data['SiteId'] + data['SiteName']
            obj1['parentId'] = data['EnterpriseId']
            obj1['parentUuid'] = data['EnterpriseId'] + data['EnterpriseName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.siteData.push({ id: data['SiteId'], name: data['SiteName'] })
          }
          let plantObj = this.plantData.find(enterp => enterp.id == data.PlantId)
          if (!plantObj) {
            let obj1 = {}
            obj1['level'] = 3
            obj1['text'] = data['PlantName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['PlantId']
            obj1['uuid'] = data['PlantId'] + data['PlantName']
            obj1['parentId'] = data['SiteId']
            obj1['parentUuid'] = data['SiteId'] + data['SiteName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.plantData.push({ id: data['PlantId'], name: data['PlantName'] })
          }
          let areaObj = this.areaData.find(enterp => enterp.id == data.AreaId)
          if (!areaObj) {
            let obj1 = {}
            obj1['level'] = 4
            obj1['text'] = data['AreaName']
            obj1['icon'] = 'assets/folder-open-outline.svg'
            obj1['id'] = data['AreaId']
            obj1['uuid'] = data['AreaId'] + data['AreaName']
            obj1['parentId'] = data['PlantId']
            obj1['parentUuid'] = data['PlantId'] + data['PlantName']
            obj1['items'] = []
            this.treeData.push(obj1)
            this.areaData.push({ id: data['AreaId'], name: data['AreaName'] })
          }

          this.treeData.push(obj)
          this.unitData.push({ id: data['UnitId'], name: data['UnitName'] })
        }
      } else if (level == 6) {
        if (data.PageId != 0) {
          obj['level'] = 6
          obj['text'] = data['PageName']
          obj['icon'] = 'assets/folder-open-outline.svg'
          obj['uuid'] = data['PageId'] + data['PageName'] + uuidv4()
          obj['id'] = data['PageId']
          obj['items'] = []
          obj['template'] = `
            <div class="page-temp-wrapper">
              <img src="assets/clipboard-outline.svg" class="dx-icon">
              <div class="page-temp">
                <span class="page-txt">${data['PageName']}</span>
              </div>
            </div>
            `
          if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId != 0 && data.UnitId != 0) {
            obj['parentId'] = data['UnitId']
            obj['parentUuid'] = data['UnitId'] + data['UnitName']
          } else if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId != 0 && data.UnitId == 0) {
            obj['parentId'] = data['AreaId']
            obj['parentUuid'] = data['AreaId'] + data['AreaName']
          } else if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId != 0 && data.AreaId == 0 && data.UnitId == 0) {
            obj['parentId'] = data['PlantId']
            obj['parentUuid'] = data['PlantId'] + data['PlantName']
          } else if (data.EnterpriseId != 0 && data.SiteId != 0 && data.PlantId == 0 && data.AreaId == 0 && data.UnitId == 0) {
            obj['parentId'] = data['SiteId']
            obj['parentUuid'] = data['SiteId'] + data['SiteName']
          } else if (data.EnterpriseId != 0 && data.SiteId == 0 && data.PlantId == 0 && data.AreaId == 0 && data.UnitId == 0) {
            obj['parentId'] = data['EnterpriseId']
            obj['parentUuid'] = data['EnterpriseId'] + data['EnterpriseName']
          }
          this.treeData.push(obj)
        }
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


  // openPdf() {
  //   const options: DocumentViewerOptions = {
  //     title: 'Cement WHRS Shift totaliser report'
  //   }
  //   this.document.viewDocument('file:///android_asset/www/assets/cement.pdf', 'application/pdf', options)
  // }

  dataStructCreate(data) {
    this.pageData = []
    data.forEach(element => {
      if (element.PageId != 0) {
        //console.log(element)
        let plantObj = this.pageData.find(plantEle => plantEle.PlantId == element.PlantId)
        if (!plantObj) {
          this.pageData.push({
            PlantId: element.PlantId,
            Plantname: element.Plantname,
            type: 'plant',
          })
        }
        plantObj = this.pageData.find(plantEle => plantEle.PlantId == element.PlantId)
        if (element.AreaId != -1) {
          //console.log("plantObj", plantObj)
          if (!plantObj.hasOwnProperty('child')) {
            plantObj['child'] = [{
              AreaId: element.AreaId,
              AreaName: element.AreaName,
              type: "area"
            }]
          } else {
            let childObj = plantObj['child'].find(areaEle => areaEle.AreaId == element.AreaId)
            if (!childObj) {
              plantObj['child'].push({
                AreaId: element.AreaId,
                AreaName: element.AreaName,
                type: "area"
              })
            }
          }
          let childObj = plantObj['child'].find(areaEle => areaEle.AreaId == element.AreaId)
          if (!childObj.hasOwnProperty('child')) {
            childObj['child'] = [{
              PageId: element.PageId,
              pageNames: element.pageNames,
              type: "page"
            }]
          } else {
            let pageObj = childObj['child'].find(pageEle => pageEle.PageId == element.PageId)
            if (!pageObj) {
              childObj['child'].push({
                PageId: element.PageId,
                pageNames: element.pageNames,
                type: "page"
              })
            }
          }
        } else {
          //console.log("plantObj", plantObj)
          //console.log("element", element)
          if (!plantObj.hasOwnProperty('child')) {
            plantObj['child'] = [{
              PageId: element.PageId,
              pageNames: element.pageNames,
              type: "page"
            }]
          } else {
            let pagedObj1 = plantObj['child'].find(pageEle => pageEle.PageId == element.PageId)
            //console.log("child obj", pagedObj1)
            if (!pagedObj1) {
              plantObj['child'].push({
                PageId: element.PageId,
                pageNames: element.pageNames,
                type: "page"
              })
            }
          }
        }
      }
    });
    //console.log("page data", this.pageData)
  }

  async openControls(id) {
    //console.log("open controls", pageData)
    //console.log("model open")
    const modal = await this.modalController.create({
      component: ViewcontrolsComponent,
      cssClass: 'fullpagemodal',
      componentProps: {
        id: id
      }
    });
    modal.onDidDismiss().then((submitData) => {
      // console.log("dismiss data", submitData)
      if (submitData.role == 'submit') {
        this.getAllPageApi()
      }
    })
    return await modal.present();
  }


  ionViewDidEnter() {
    //console.log("call ng init")
    this.getAllPageApi()
    if (localStorage.getItem('data')) {
      this.pageData = JSON.parse(localStorage.getItem('data'))
    }
    if(localStorage.getItem('graphicsUrl')) {
      this.graphicsUrl = localStorage.getItem('graphicsUrl')
    }
    this.userName = localStorage.getItem('userName');
    this.password = localStorage.getItem('encryptedPassword');
    console.log("rrr",this.userName,this.password);
  }


  doRefresh(event) {
    this.getAllPageApi()
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }



}
