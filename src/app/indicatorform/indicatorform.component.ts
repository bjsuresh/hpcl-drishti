import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TagSelectComponent } from '../tag-select/tag-select.component'

@Component({
  selector: 'app-indicatorform',
  templateUrl: './indicatorform.component.html',
  styleUrls: ['./indicatorform.component.scss'],
})
export class IndicatorformComponent implements OnInit {

  @Input() data: any;
  tagsData = []
  // conditionsArray = ['>','<','>=','<=','=']
  conditionsArray = ['=']
  groupOfTags = []
  color = 'gray'
  title: any;
  customAlertOptions = {
    cssClass: 'tag-select'
  }
  constructor(public modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.groupOfTags.push({
      'tag': null,
      'aliasName': null,
      'tagsData' : [],
      'optionValue': '1',
       condition: [{
         'value': '0',
         'symbol': '=',
         'color': '#000000',
       },{
        'value': '1',
        'symbol': '=',
        'color': '#000000',
      }]
    })
    console.log(this.groupOfTags)
    if(this.data) {
      this.title = this.data['title']
      this.groupOfTags = this.data['data']
    }
  }

  tagValidator(control: AbstractControl) {
    // console.log("valid value", control)
    if(control.value.length > 8) {
      return { tagLength : true}
    }
    return null
  }

  dismissModal() {
    this.modalController.dismiss('',  'cancel')
  }

  addTag() {
    this.groupOfTags.push({
      'tag': null,
      'aliasName': null,
      'tagsData' : [],
      'optionValue': '1',
      condition: [{
        'value': '0',
        'symbol': '=',
        'color': '#000000',
      },{
       'value': '1',
       'symbol': '=',
       'color': '#000000',
     }]
    })
  }

  async addTags(tag) {
    const modal = await this.modalController.create({
      component: TagSelectComponent,
      componentProps: {
        mode: 'single',
        selectedTags: tag['tagsData'] // Pass the previously selected tags
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      if(submitData.role == 'submit') {
        if(submitData.data.length != 0) {
          tag['tag'] = submitData.data.map(data => data['TagName']);
          tag['tagsData'] = submitData.data;
  
          // Log the updated values for debugging
          console.log("tag-data", this.tagsData, tag['tag']);
  
          // You may not need the following line as 'tag' is already updated
          // this.groupOfTags['tag'] = submitData.data;
  
          // Update the 'tagsData' property with the updated 'groupOfTags'
          this.tagsData = this.groupOfTags;

          // this.tagsData = tag; // Extract TagNames from selected tags
          console.log("tag-data",this.tagsData, this.groupOfTags['tag']);

          // this.controlForm.get('tags').setValue(selectedTags);
        }

      }
    })
    return await modal.present();
  }

  addCondition(tag) {
    tag['condition'].push({
      'value': null,
      'symbol': '=',
      'color': '#0e4a8d',
    })
  }

  deleteCondition(tag, index) {
    tag['condition'].splice(index, 1)
  }

  deleteTag(index) {
    this.groupOfTags.splice(index, 1)
  }

  controlFormSubmit() {
    let postData = {}
    postData['title'] = this.title
    postData['data'] = this.groupOfTags
    postData['tagsData'] = this.tagsData
    console.log(postData)
    this.modalController.dismiss(postData, 'submit')
  }


  
}
