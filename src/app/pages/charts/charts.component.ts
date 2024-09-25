import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  dataSource = [{
    day: "2020-03-20 10:00:00",
    oranges: 88
  }, {
    day: "2020-03-20 11:00:00",
    oranges: 74
  }, {
    day: "2020-03-20 12:00:00",
    oranges: 18
  }, {
    day: "2020-03-20 13:00:00",
    oranges: 65
  }, {
    day: "2020-03-20 14:00:00",
    oranges: 69
  }, {
    day: "2020-03-20 15:00:00",
    oranges: 78
  }, {
    day: "2020-03-20 16:00:00",
    oranges: 30
  }];
  tableData = [{
    "Tagname": '10HBK10CP101',
    "Value": '88',
    "Timestamp": "2020-03-20 10:04:00",
    "Description": "Mill1 inlet temperature"
  },{
    "Tagname": '10HFC01CT111-HI',
    "Value": '67',
    "Timestamp": "2020-03-20 10:01:00",
    "Description": "Mill2 inlet temperature"
  },{
    "Tagname": '10HNA12CT105',
    "Value": '23',
    "Timestamp": "2020-03-20 10:08:00",
    "Description": "Mill1 outlet temperature"
  },{
    "Tagname": '10HFE01AN001',
    "Value": '78',
    "Timestamp": "2020-03-20 10:04:00",
    "Description": "Mill2 outlet temperature"
  },{
    "Tagname": '10HFC01AN001_XB48',
    "Value": '1',
    "Timestamp": "2020-03-20 11:02:00",
    "Description": "Mill Elec O.L Protection"
  }];
  constructor(private screenOrientation: ScreenOrientation) { 
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ngOnInit() {}

}
