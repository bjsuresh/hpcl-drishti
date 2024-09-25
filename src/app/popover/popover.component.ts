import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() data: any;
  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
    console.log('popover data', this.data)
  }

  dismissPopover(value) {
    this.popoverController.dismiss(value).then(res => {
     
    })
  }

}
