import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  dataSource = [{
    day: "2020-03-24 09:00:00",
    oranges: 23
  }, {
    day: "2020-03-24 09:10:00",
    oranges: 65
  }, {
    day: "2020-03-24 09:20:00",
    oranges: 98
  }, {
    day: "2020-03-24 09:30:00",
    oranges: 12
  }, {
    day: "2020-03-24 09:40:00",
    oranges: 40
  }, {
    day: "2020-03-24 09:50:00",
    oranges: 70
  }, {
    day: "2020-03-24 10:00:00",
    oranges: 10
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
  constructor() { }

  ngOnInit() {
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
