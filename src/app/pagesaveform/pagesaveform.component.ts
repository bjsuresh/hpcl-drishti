import { Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { PagesService } from '../pages/pages.service'
import { ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-pagesaveform',
  templateUrl: './pagesaveform.component.html',
  styleUrls: ['./pagesaveform.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagesaveformComponent implements OnInit {

  @Input() data: any;
  @Input() areaData: any;
  @Input() plantData: any;
  @Input() enterpriseData: any;
  @Input() siteData: any;
  @Input() unitData: any;

  controlForm: FormGroup;
  PlantAreaData = []
  enterpriseOptions = []
  siteOptions = []
  plantOptions = []
  areaOptions = []
  unitOptions = []
  PageProperties = [];
  PageAccessTypeOptions = [
    { "name": "Normal", "value": "N" }, 
    { "name": "Exclusive", "value": "E" }, 
    { "name": "Common", "value": "C" }
  ]
  enterpriseSubscription: Subscription
  private siteSubscription: Subscription;
  private plantSubscription: Subscription;
  private areaSubscription: Subscription;
  constructor(public toastController: ToastController, public modalController: ModalController, private fb: FormBuilder, private pageService: PagesService) { }

  ngOnInit() {
    this.controlForm = this.fb.group({
      PageName: ['', [Validators.required],[this.restrictedKeywordsValidator(['<', '>', ,'/','\\'])]],
      PlantorArea:['P'],
      // PlantAreaId: ['', Validators.required],
      RefreshRate: ['', Validators.required],
      PageAccessType: ['', Validators.required],
      MapType:['Un'],
      EnterpriseId: ['', Validators.required],
      SiteId: ['', Validators.required],
      PlantId: ['', Validators.required],
      AreaId: ['', Validators.required],
      UnitId: ['', Validators.required],
    })
    this.controlForm.get('PageAccessType').valueChanges.subscribe(value => {
      if(value == 'E') {
        this.controlForm.removeControl('MapType')
        this.controlForm.removeControl('EnterpriseId')
        this.controlForm.removeControl('SiteId')
        this.controlForm.removeControl('PlantId')
        this.controlForm.removeControl('AreaId')
        this.controlForm.removeControl('UnitId')
      } else {
        this.controlForm.addControl('MapType', new FormControl(''))
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('SiteId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('PlantId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('AreaId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('UnitId', new FormControl('', [Validators.required]))
        this.valueChange()
      }
    })
    if(this.data) {
      console.log("data +++", this.data)
      this.pageService.getByIdPageDetails(this.data.PageId).subscribe((pagData: any) => {
        // console.log("-------------------", pagData)
        this.PageProperties = JSON.parse(pagData).pageproperties
        if(this.data.pOrAtype == 'E') {
          this.PlantAreaData = this.plantData 
        } else if(this.data.pOrAtype == 'S') {
          this.PlantAreaData = this.siteData
        } else if(this.data.pOrAtype == 'P') {
          this.PlantAreaData = this.plantData
        } else if(this.data.pOrAtype == 'A') {
          this.PlantAreaData = this.areaData
        } else if(this.data.pOrAtype == 'Un') {
          this.PlantAreaData = this.unitData
        }
        this.controlForm.patchValue({
          PageName: this.data.pageNames,
          PlantorArea: 'P',
          // PlantAreaId: this.data.pageOrAreaId,
          RefreshRate: JSON.parse(pagData).RefreshRate,
          MapType:this.data.pOrAtype,
        })
        if(this.data.pOrAtype == 'E') {
         this.controlForm.get('EnterpriseId').patchValue(this.data.pageOrAreaId)
        } else if(this.data.pOrAtype == 'S') {
          this.controlForm.get('SiteId').patchValue(this.data.pageOrAreaId)
        } else if(this.data.pOrAtype == 'P') {
          this.controlForm.get('PlantId').patchValue(this.data.pageOrAreaId)
        } else if(this.data.pOrAtype == 'A') {
          this.controlForm.get('AreaId').patchValue(this.data.pageOrAreaId)
        } else if(this.data.pOrAtype == 'Un') {
         this.controlForm.get('UnitId').patchValue(this.data.pageOrAreaId)
        }
      })
    }
    console.log(this.enterpriseData)
    this.enterpriseOptions = this.enterpriseData
    this.valueChange()
    console.log("edit data", this.data)
  }

  valueChange() {
    this.controlForm.get('MapType').valueChanges.subscribe(val => {
      console.log("value changes")
      // if(this.data) {
      //   this.controlForm.get('PlantAreaId').patchValue(this.data.pageOrAreaId)
      // } else {
      //   this.controlForm.get('PlantAreaId').patchValue('')
      // }
      this.enterpriseSubscription.unsubscribe()
      this.areaSubscription.unsubscribe()
      this.plantSubscription.unsubscribe()
      this.siteSubscription.unsubscribe()
      if(val == 'E') {
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.removeControl('SiteId')
        this.controlForm.removeControl('PlantId')
        this.controlForm.removeControl('AreaId')
        this.controlForm.removeControl('UnitId')
        this.subscribeControl(true, false, false, false)
      } else if(val == 'S') {
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('SiteId', new FormControl('', [Validators.required]))
        this.controlForm.removeControl('PlantId')
        this.controlForm.removeControl('AreaId')
        this.controlForm.removeControl('UnitId')
        this.removeSubscribeControl()
        this.subscribeControl(true, true, false, false)
      } else if(val == 'P') {
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('SiteId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('PlantId', new FormControl('', [Validators.required]))
        this.controlForm.removeControl('AreaId')
        this.controlForm.removeControl('UnitId')
        this.removeSubscribeControl()
        this.subscribeControl(true, true, true, false)
      } else if(val == 'A') {
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('SiteId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('PlantId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('AreaId', new FormControl('', [Validators.required]))
        this.controlForm.removeControl('UnitId') 
        this.removeSubscribeControl()
        this.subscribeControl(true, true, true, true)
      } else if(val == 'Un') {
        this.controlForm.addControl('EnterpriseId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('SiteId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('PlantId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('AreaId', new FormControl('', [Validators.required]))
        this.controlForm.addControl('UnitId', new FormControl('', [Validators.required]))
        this.removeSubscribeControl()
        this.subscribeControl(true, true, true, true)
      } 
    })
    this.subscribeControl(true, true, true, true)
  }

  subscribeControl(EnterpriseId, SiteId, PlantId, AreaId) {
    if(EnterpriseId) {
      console.log(EnterpriseId, SiteId, PlantId, AreaId)
      this.enterpriseSubscription = this.controlForm.get('EnterpriseId').valueChanges.subscribe(val => {
        this.pageService.GetSitesByEnterpriseId(val).subscribe((data: any) => {
          this.siteOptions = JSON.parse(data)
        })
      })
    }

    if(SiteId) {
      this.siteSubscription = this.controlForm.get('SiteId').valueChanges.subscribe(val => {
        this.pageService.GetPlantsBySiteId(val).subscribe((data: any) => {
          this.plantOptions = JSON.parse(data)
        })
      })
    }

    if(PlantId) {
      this.plantSubscription = this.controlForm.get('PlantId').valueChanges.subscribe(val => {
        this.pageService.GetAreasByPlantId(val).subscribe((data: any) => {
          this.areaOptions = JSON.parse(data)
        })
      })
    }

    if(AreaId) {
      this.areaSubscription = this.controlForm.get('AreaId').valueChanges.subscribe(val => {
        this.pageService.GetUnitsByAreaId(val).subscribe((data: any) => {
          this.unitOptions = JSON.parse(data)
        })
      })
    }    
  }

  removeSubscribeControl() {
    // this.enterpriseSubscription.unsubscribe()
   
  }

  restrictedKeywordsValidator(keywords: string[]): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return new Promise((resolve) => {
        const value = control.value;
        const containsRestrictedKeywords = keywords.some(keyword => value.includes(keyword));
  
        if (containsRestrictedKeywords) {
          resolve({ restrictedKeywords: true });
        } else {
          resolve(null);
        }
      });
    };
  }

  update() {

    let postData = {}
      postData['PageId'] = this.data.PageId
      postData['PageName'] = this.controlForm.get('PageName').value
      postData['pageType'] = 'M'
      postData['PageProperties'] = this.PageProperties
      postData['RefreshRate'] = this.controlForm.get('RefreshRate').value

      this.pageService.updatePage(postData).subscribe(resFormApi => {
        // console.log("resFormApi", resFormApi)
        this.presentToast('Successfully Updated')
        this.modalController.dismiss(this.controlForm.value, 'submit')
      })
      
  }


  dismissModal() {
    this.modalController.dismiss('',  'cancel')
  }

  controlFormSubmit() {
    if(this.controlForm.invalid) {
      this.controlForm.markAllAsTouched()
      //this.modalController.dismiss(this.controlForm.value, 'submit')
    } else {
      console.log("form value", this.controlForm.value)
      let postData = this.controlForm.value
      if(postData['MapType'] == 'E') {
        postData['PlantAreaId'] = this.controlForm.get('EnterpriseId').value
      } else if(postData['MapType'] == 'S') {
        postData['PlantAreaId'] = this.controlForm.get('SiteId').value
      } else if(postData['MapType'] == 'P') {
        postData['PlantAreaId'] = this.controlForm.get('PlantId').value
      } else if(postData['MapType'] == 'A') {
        postData['PlantAreaId'] = this.controlForm.get('AreaId').value
      } else if(postData['MapType'] == 'Un') {
        postData['PlantAreaId'] = this.controlForm.get('UnitId').value
      } else {
        postData['PlantAreaId'] = 0
      }
      postData['pageType'] = 'M'
      // postData['PageProperties'] = this.PageProperties
      postData['PageProperties'] = '[]'
      this.pageService.addPage(postData).subscribe(resFormApi => {
        // console.log("resFormApi", resFormApi)
        this.presentToast('Successfully Added')
        this.modalController.dismiss(this.controlForm.value, 'submit')
    })
    }
  }

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}
