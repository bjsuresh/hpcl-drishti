import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { TagSelectComponent } from '../tag-select/tag-select.component'

@Component({
  selector: 'app-controlform',
  templateUrl: './controlform.component.html',
  styleUrls: ['./controlform.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControlformComponent implements OnInit {

  @Input() data: any;
  tagsData = [];
  @Input() aggerateData: any
  controlForm: FormGroup;
  customAlertOptions = {
    cssClass: 'tag-multiple-select'
  }
  constructor(public modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    console.log("processfor init", this)
    this.controlForm = this.fb.group({
      title: ['', Validators.required],
      arugumentAxis: ['', Validators.required],
      valueAxis: ['', Validators.required],
      chartType: ['', Validators.required],
      processFor: ['', Validators.required],
      tags: ['', [Validators.required, this.tagValidator]],
      pointFlag: [false],
      gridFlag: [false]
    })
    this.controlForm.get('processFor').valueChanges.subscribe(val => {
      if(val == 'realtime') {
        this.controlForm.addControl('showData', new FormControl('', [Validators.required]))
        this.controlForm.addControl('lastData', new FormControl('', [Validators.required]))
        this.controlForm.addControl('startFresh', new FormControl(false))
        // this.controlForm.removeControl('queryFor')
        this.controlForm.removeControl('readFor')
        this.controlForm.removeControl('from')
        this.controlForm.removeControl('to')
        this.controlForm.removeControl('fromTime')
        this.controlForm.removeControl('toTime')
        this.controlForm.removeControl('interval')
        this.controlForm.removeControl('intervalType')
        this.controlForm.removeControl('operations')
        this.controlForm.removeControl('lastnndays') 
        this.controlForm.removeControl('hours')
        this.controlForm.removeControl('days')
        this.controlForm.removeControl('minutes')
        this.controlForm.removeControl('maxRows')
      } else {  
        this.controlForm.removeControl('showData')
        this.controlForm.removeControl('lastData')
        this.controlForm.removeControl('startFresh')
        // this.controlForm.addControl('queryFor', new FormControl('', [Validators.required]))
        this.controlForm.addControl('readFor', new FormControl('', [Validators.required]))
        this.controlForm.get('readFor').valueChanges.subscribe(val => {
          if(val == 'process') {
            this.controlForm.addControl('interval', new FormControl('', [Validators.required]))
            this.controlForm.addControl('intervalType', new FormControl('', [Validators.required]))
            this.controlForm.addControl('operations', new FormControl('', [Validators.required]))
            // this.controlForm.get('interval').valueChanges.subscribe(val => {
            //   if(val == 'minutes') {
            //     this.controlForm.addControl('minutes', new FormControl('', [Validators.required]))
            //     this.controlForm.removeControl('hours')
            //     this.controlForm.removeControl('days')
            //   } else if (val == 'days') { 
            //     this.controlForm.addControl('days', new FormControl('', [Validators.required]))
            //     this.controlForm.removeControl('minutes')
            //     this.controlForm.removeControl('hours')
            //   } else {
            //     this.controlForm.addControl('hours', new FormControl('', [Validators.required]))
            //     this.controlForm.removeControl('minutes')
            //     this.controlForm.removeControl('days')
            //   }
            // })
            this.controlForm.removeControl('maxRows')
          } else {
            this.controlForm.addControl('maxRows', new FormControl('', [Validators.required]))
            this.controlForm.removeControl('interval')
            this.controlForm.removeControl('intervalType')
            this.controlForm.removeControl('operations')
            // this.controlForm.removeControl('minutes')
            // this.controlForm.removeControl('hours')
            // this.controlForm.removeControl('days')
          }
        })
        // this.controlForm.get('queryFor').valueChanges.subscribe(val => {
          // if(val == 'datarange') {
            this.controlForm.addControl('from', new FormControl(moment().format(), [Validators.required]))
            this.controlForm.addControl('to', new FormControl(moment().format(), [Validators.required]))
            this.controlForm.addControl('fromTime', new FormControl(moment().subtract(5, 'minutes').format(), [Validators.required]))
            this.controlForm.addControl('toTime', new FormControl(moment().format(), [Validators.required]))
            // this.controlForm.removeControl('lastnndays')
          // } else {
            // this.controlForm.addControl('lastnndays', new FormControl('', [Validators.required]))     
            // this.controlForm.removeControl('from')
            // this.controlForm.removeControl('to')
            // this.controlForm.removeControl('fromTime')
            // this.controlForm.removeControl('toTime')
          // }
        // })
      }
    })
    if(this.data) {
      console.log("------",this.tagsData)
      this.tagsData = this.data['tagsData']
      this.controlForm.patchValue(this.data)
    }
  }

  dismissModal() {
    this.modalController.dismiss('',  'cancel')
  }

  async addTags() {
    const modal = await this.modalController.create({
      component: TagSelectComponent,
      componentProps: {
        mode: 'multiple',
        selectedTags: this.tagsData // Pass the previously selected tags
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      if(submitData.role == 'submit') {
        if(submitData.data.length != 0) {
         console.log("tg",this.tagsData);
         this.tagsData = submitData.data

          // const newTags = submitData.data;
          // // Extract existing tag names from the tagsData array
          // const existingTags = this.tagsData.map(tag => tag['TagName']);
          // // Add new tags that are not already in the tagsData array
          // newTags.forEach(newTag => {
          //   const newTagName = newTag['TagName'];
          //   if (!existingTags.includes(newTagName)) {
          //     this.tagsData.push(newTag);
          //     existingTags.push(newTagName); // Update the existing tags list
          //   }
          // });
    
          // this.tagsData = this.tagsData.concat(submitData.data);
          // this.tagsData.push(submitData.data);
          // this.tagsData = submitData.data

          console.log("tag-data",this.tagsData);
          const selectedTags = this.tagsData.map(tag => tag['TagName']); // Extract TagNames from selected tags

          this.controlForm.get('tags').setValue(selectedTags);
        }
      }
    })
    return await modal.present();
  }
 
  controlFormSubmit() {
    if(this.controlForm.valid) {
      let postData = this.controlForm.value
      postData['tagsData'] = this.tagsData
      // if(postData.processFor == "query") {
      //   if(postData.queryFor == "datarange") {
      //     if(this.data) {
      //       if(postData['from'] == this.data.from) {
      //         postData['from'] =  postData['from']
      //       } else {
      //         postData['from'] = moment(postData['from']).format('YYYY-MM-DD')
      //       }
      //       if(postData['to'] == this.data.to) {
      //         postData['to'] =  postData['to']
      //       } else {
      //         postData['to'] = moment(postData['to']).format('YYYY-MM-DD')
      //       }
      //     } else {
      //       postData['from'] = moment(postData['from']).format('YYYY-MM-DD')
      //       postData['to'] = moment(postData['to']).format('YYYY-MM-DD')
      //     }
      //     if(!this.data) {
      //       postData['fromTime'] = moment(postData['fromTime']).format('HH:mm')
      //       postData['toTime'] = moment(postData['toTime']).format('HH:mm')
      //     }
      //   } 
      // }
      console.log("form value", postData)
      this.modalController.dismiss(postData, 'submit')
    } else {
      this.controlForm.markAllAsTouched()
    }
  }


  tagValidator(control: AbstractControl) {
    // console.log("valid value", control)
    if(localStorage.getItem('tagsNumber')) {
      let num = Number(localStorage.getItem('tagsNumber'))
      if(control.value.length > 8) {
        return { tagLength : true}
      } else {
        return null
      } 
    } else {
      return null
    }
  }

}
