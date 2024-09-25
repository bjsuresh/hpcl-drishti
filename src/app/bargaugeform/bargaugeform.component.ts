import { Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagSelectComponent } from '../tag-select/tag-select.component'

@Component({
  selector: 'app-bargaugeform',
  templateUrl: './bargaugeform.component.html',
  styleUrls: ['./bargaugeform.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BargaugeformComponent implements OnInit {

  @Input() data: any;
  tagsData = []
  controlForm: FormGroup;
  customAlertOptions = {
    cssClass: 'tag-select'
  }
  constructor(public modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.controlForm = this.fb.group({
      title: ['', Validators.required],    
      startvalue:['', Validators.required], 
      endvalue:['', Validators.required], 
      tags: ['', Validators.required]
    })
    if(this.data) {
      this.tagsData = this.data['tagsData']
      this.data['tags'] = this.data['tags'][0]
      this.controlForm.patchValue(this.data)
    }
  }

  async addTags() {
    const modal = await this.modalController.create({
      component: TagSelectComponent,
      componentProps: {
        mode: 'single',
        selectedTags: this.tagsData // Pass the previously selected tags
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      if(submitData.role == 'submit') {
        if(submitData.data.length != 0) {
          this.tagsData = submitData.data
          // setTimeout(() => {
          //   this.controlForm.get('tags').patchValue(submitData.data.map(data => data['TagName']))
          // })
          console.log("tag-data",this.tagsData);

          const selectedTags = this.tagsData.map(tag => tag['TagName']); // Extract TagNames from selected tags

          this.controlForm.get('tags').setValue(selectedTags);
        }
      }
    })
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss('',  'cancel')
  }

  controlFormSubmit() {
    if(this.controlForm.valid) {
      let postData = this.controlForm.value
      postData['tags'] = [postData['tags']]
      postData['tagsData'] = this.tagsData
      this.modalController.dismiss(postData, 'submit')
    } else {
      this.controlForm.markAllAsTouched()
      // this.modalController.dismiss(this.controlForm.value, 'submit')
    }
  }

}
