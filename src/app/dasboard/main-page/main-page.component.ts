import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {

  layoutData: any
  dataSource = [{
    day: "2020-03-20 10:00:00",
    oranges: 12
  }, {
    day: "2020-03-20 11:00:00",
    oranges: 25
  }, {
    day: "2020-03-20 12:00:00",
    oranges: 35
  }, {
    day: "2020-03-20 13:00:00",
    oranges: 40
  }, {
    day: "2020-03-20 14:00:00",
    oranges: 28
  }, {
    day: "2020-03-20 15:00:00",
    oranges: 60
  }, {
    day: "2020-03-20 16:00:00",
    oranges: 90
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
  constructor(private aroute: ActivatedRoute) { }

  ngOnInit() {
    this.aroute.params.subscribe(params => {
      this.layoutData = JSON.parse(localStorage.getItem('data')).filter(data => data.pagename == params.id)[0]
    })
  }

}
