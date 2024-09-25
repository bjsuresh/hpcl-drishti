import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {  PagesService } from '../pages/pages.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.scss'],
})
export class TagSelectComponent implements OnInit {
  tagsData = []
  pageNumber = 1;
  count = 100;
  searchInput;
  selectedItem = []
  @Input() mode: string
  @Input() selectedTags: [];

  @ViewChild('list', { static: false}) dxList: any;

  loading: any;

  constructor(public modalController: ModalController,public loadingController: LoadingController, public toastController: ToastController, private pageService: PagesService) { }

  async ngOnInit() {
    await this.presentLoading();
    console.log(this.mode,this.selectedTags)
    this.pageService.GetTagsOnly(this.pageNumber, this.count, '').subscribe((dataFormApi: any) => {
        this.tagsData = JSON.parse(dataFormApi)
        this.loading.dismiss()
    }, (err) => {
      console.log(err)
      this.loading.dismiss()
      this.presentToast('Tags api failed')
    })
    console.log("d",this.selectedItem,this.tagsData);

  }

  ionViewDidEnter(){
    this.selectedItem = this.selectedTags;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles',
      // message: '',
      duration: 1000,
      });

    await this.loading.present();
  }
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  dismissModal() {
    this.modalController.dismiss('',  'cancel')
  }

  searchBarChanged() {
    console.log(this.searchInput)
    this.pageNumber = 1
    let search = this.searchInput
    if(search) {
      search = this.searchInput.toLocaleLowerCase().replace(' ', '').trim()
    }
    console.log(this.dxList.selectedItems, this.dxList)
    if(this.mode == 'single') {
      this.selectedItem = this.dxList.selectedItems
    } else {
      this.selectedItem = this.selectedItem.concat(this.dxList.selectedItems)
    }
    this.pageService.GetTagsOnly(this.pageNumber, this.count, search).subscribe((dataFormApi: any) => {
        this.tagsData = []
        this.tagsData = JSON.parse(dataFormApi)
        if(JSON.parse(dataFormApi).length != 0) {
          this.tagsData = JSON.parse(dataFormApi)
        }
    })
  }

  viewMore() {
    this.pageNumber += 1
    let search = this.searchInput
    if(search) {
      search = this.searchInput.toLocaleLowerCase().replace(' ', '').trim()
    } else {
      search = ''
    }
    this.pageService.GetTagsOnly(this.pageNumber, this.count, search).subscribe((dataFormApi: any) => {
      if(JSON.parse(dataFormApi).length != 0) {
       this.tagsData = this.tagsData.concat(JSON.parse(dataFormApi))
      }
    })
  }

  submitTags() {
    console.log(this.selectedItem)
    this.modalController.dismiss(this.selectedItem,  'submit')
  }

  onSelectionChanged(event) {
 
    if(this.mode === 'single'){
      this.selectedItem = [];
    }
    
     event.addedItems.forEach(addedItem => {
      const existingIndex = this.selectedItem.findIndex(
        item => item.TagID === addedItem.TagID
      );
      if (existingIndex === -1) {
        this.selectedItem.push(JSON.parse(JSON.stringify(addedItem)));
      }
    });
  
    event.removedItems.forEach(removedItem => {
      const existingIndex = this.selectedItem.findIndex(
        item => item.TagID === removedItem.TagID
      );
      if (existingIndex !== -1) {
        this.selectedItem.splice(existingIndex, 1);
      }
    });
    this.selectedItem = this.selectedItem.filter(
      (v, i, a) => a.findIndex(t => t.TagID === v.TagID) === i
    );
    console.log(event, this.selectedItem)
  }


}
