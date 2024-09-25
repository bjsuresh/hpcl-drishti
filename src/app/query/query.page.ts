import { Component, OnInit } from '@angular/core';
import { QueryformComponent } from '../query/queryform/queryform.component'
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { PagesService } from '../pages/pages.service'
import { interval, Subscription } from 'rxjs';
import { SingleViewControlComponent } from '../single-view-control/single-view-control.component'
import { environment } from '../../environments/environment'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-query',
  templateUrl: './query.page.html',
  styleUrls: ['./query.page.scss'],
})
export class QueryPage implements OnInit {

  UTCEnable=environment.utc
  dataSource: any
  decimalPoint = 2;
  timeFormat = 'YYYY/MM/DD HH:mm';
  gridfields = ['Name', 'Description', 'Time']
  queryProperty: any;
  subscription = new Subscription();
  aggerateData: any;
  role: any;
  tagsData: [];
  query:any = ""

  constructor(public modalController: ModalController, private screenOrientation: ScreenOrientation, private pageService: PagesService) { }


  ngOnInit() {
  //  this.role = localStorage.getItem('AdminType')
  //   this.dataSource = [{
  //     day: "2020-03-20 10:00:00",
  //     oranges: 400
  //   }, {
  //     day: "2020-03-20 11:00:00",
  //     oranges: 240
  //   }, {
  //     day: "2020-03-20 12:00:00",
  //     oranges: 300
  //   }, {
  //     day: "2020-03-20 13:00:00",
  //     oranges: 380
  //   }, {
  //     day: "2020-03-20 14:00:00",
  //     oranges: 640
  //   }, {
  //     day: "2020-03-20 15:00:00",
  //     oranges: 1100
  //   }, {
  //     day: "2020-03-20 16:00:00",
  //     oranges: 890
  //   }];
    this.constructData()
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe()
  }

  ionViewDidEnter() {
    if(localStorage.getItem('noOfDecimal')) {
      this.decimalPoint = Number(localStorage.getItem('noOfDecimal'))
    }
    if(localStorage.getItem('timeFormat')) {
      this.timeFormat = localStorage.getItem('timeFormat')
    } else {
      this.timeFormat = 'YYYY/MM/DD HH:mm'
    }
    this.subscription = new Subscription()
    console.log("call ionViewDidEnter")
    this.role = localStorage.getItem('AdminType')
    this.dataSource = [{
      day: "2020-03-20 10:00:00",
      oranges: 400
    }, {
      day: "2020-03-20 11:00:00",
      oranges: 240
    }, {
      day: "2020-03-20 12:00:00",
      oranges: 300
    }, {
      day: "2020-03-20 13:00:00",
      oranges: 380
    }, {
      day: "2020-03-20 14:00:00",
      oranges: 640
    }, {
      day: "2020-03-20 15:00:00",
      oranges: 1100
    }, {
      day: "2020-03-20 16:00:00",
      oranges: 890
    }];
    if(localStorage.getItem('query')){
      this.constructData();
    }
    this.query = localStorage.getItem('query');
    console.log("query",this.query);
  }

  async openControlForm() {
    const modal = await this.modalController.create({
      component: QueryformComponent,
      componentProps: {
        data: JSON.parse(localStorage.getItem('query')),
        aggerateData: this.aggerateData,
        tagsData: this.tagsData
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("dismiss data", submitData)
      if (submitData.role == 'submit') {
        this.constructData()
      }
    })
    return await modal.present();
  }

  constructData() {
    // this.pageService.GetTags().subscribe((data: any) => {
    //   this.tagsData = JSON.parse(data);
    //   console.log("get all tags", this.tagsData);
    // })
     
    this.pageService.GetAggreates().subscribe((data: any) => {
      console.log("aggData",this.aggerateData);
      this.aggerateData = JSON.parse(data);     
    })
    this.query = localStorage.getItem('query');

    let queryProperty = JSON.parse(localStorage.getItem('query'))
    if (queryProperty) {
      queryProperty['tagNames'] = ''
      queryProperty['chartDataSource'] = []
      queryProperty['predataSource'] = []
      queryProperty['tableDataSource'] = []
      queryProperty['pretableDataSource'] = []
      queryProperty['zoom'] = false;
      queryProperty['tags'].forEach((tag, index) => {
        if (index == 0) {
          queryProperty['tagNames'] = tag
        } else {
          queryProperty['tagNames'] = queryProperty['tagNames'] + ',' + tag
        }
      })
      if (queryProperty['processFor'] == 'query') {
        let from;
        let to;
        // if (queryProperty.hasOwnProperty('lastnndays')) {
        //   from = moment().subtract(queryProperty.lastnndays, 'days').format('YYYY-MM-DD HH:mm')
        //   to = moment().format('YYYY-MM-DD HH:mm')
        // } else {
          if(this.UTCEnable) {
            from = moment(moment(queryProperty.from).format('YYYY-MMM-DD') + ' ' + moment(queryProperty.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')
            to = moment(moment(queryProperty.to).format('YYYY-MMM-DD') + ' ' + moment(queryProperty.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')  
          } else {
            from = moment(moment(queryProperty.from).format('YYYY-MMM-DD') + ' ' + moment(queryProperty.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')
            to = moment(moment(queryProperty.to).format('YYYY-MMM-DD') + ' ' + moment(queryProperty.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')

          }
          // from = moment(queryProperty.from + ' ' + queryProperty.fromTime, 'YYYY-MM-DD HH:mm').format('YYYY-MMM-DD HH:mm:ss')
          // to = moment(queryProperty.to + ' ' + queryProperty.toTime, 'YYYY-MM-DD HH:mm').format('YYYY-MMM-DD HH:mm:ss')
        // }
        if (queryProperty.readFor == 'process') {
          let aggerate;
          let interval;
          queryProperty['tags'].forEach((tag, index) => {
            if (index == 0) {
              aggerate = queryProperty.operations
            } else {
              aggerate = queryProperty.operations + ',' + aggerate
            }
          })
          if (queryProperty.interval) {
            interval = Math.round(moment(to, 'YYYY-MMM-DD HH:mm:ss').diff(moment(from, 'YYYY-MMM-DD HH:mm:ss'), 'seconds') / queryProperty.interval)
          } 
          // if (queryProperty.interval == 'minutes') {
          //   interval = queryProperty.minutes * 60
          // } else if (queryProperty.interval == 'hours') {
          //   interval = queryProperty.hours * 3600
          // } else {
          //   interval = queryProperty.days * 86400
          // }
          this.pageService.GetReadProcessed({ tagNames: queryProperty['tagNames'], from: from, to: to, aggerate: aggerate, 
          sampleIntervalValue: queryProperty['interval'],
          sampleIntervalType: queryProperty['intervalType']  }).subscribe((responseFormData: any) => {
            let tempArray = []
            JSON.parse(responseFormData).forEach((tableData => {
              let flag = 0
              queryProperty['chartDataSource'].forEach(tempData => {
                if (tableData.D == tempData.D) {
                  if(this.UTCEnable) {
                    tempData['datetime'] = moment.utc(tableData.D).local().format(this.timeFormat)
                  } else {
                    tempData['datetime'] = moment(tableData.D).format(this.timeFormat)
                  }
                  tempData['D'] = tableData.D
                  tempData[tableData.T] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData.V).toFixed(this.decimalPoint)
                  flag = 1
                }
              })
              if (flag == 0) {
                let obj = {}
                if(this.UTCEnable) {
                  obj['datetime'] = moment.utc(tableData.D).local().format(this.timeFormat)
                } else {
                  obj['datetime'] = moment(tableData.D).format(this.timeFormat)
                }
                obj['D'] = tableData.D
                obj[tableData.T] =  isNaN(tableData['V']) ? tableData['V'] : Number(tableData.V).toFixed(this.decimalPoint)
                queryProperty['chartDataSource'].push(obj)
              }
              let obj = {}
              queryProperty['displayfields'].forEach(field => {
                if (field == 'Name') {
                  obj['Name'] = tableData['T']
                } else if (field == 'Value') {
                  obj['Value'] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData['V']).toFixed(this.decimalPoint)
                } else if (field == 'TimeStamp') {
                  if(this.UTCEnable) {
                    obj['TimeStamp'] = moment.utc(tableData['D']).local().format(this.timeFormat)
                  } else {
                    obj['TimeStamp'] = moment(tableData['D']).format(this.timeFormat)
                  }
                } else if (field == 'Quality') {
                  obj['Quality'] = tableData['Q']
                } else if (field == 'Description') {
                  obj['Description'] = tableData['M']
                }
              })
              tempArray.push(obj)
            }))
            queryProperty['tableDataSource'] = tempArray
          })
        } else {
          this.pageService.GetReadRawValues({ tagNames: queryProperty['tagNames'], from: from, to: to, row: queryProperty.maxRows }).subscribe((responseFormData: any) => {
            let tempArray = []
            JSON.parse(responseFormData).forEach((tableData => {
              let flag = 0
              queryProperty['chartDataSource'].forEach(tempData => {
                if (tableData.D == tempData.D) {
                  if(this.UTCEnable) {
                    tempData['datetime'] = moment.utc(tableData.D).local().format(this.timeFormat)
                  } else {
                    tempData['datetime'] = moment(tableData.D).format(this.timeFormat)
                  }
                  tempData['D'] = tableData.D
                  tempData[tableData.T] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData.V).toFixed(this.decimalPoint)
                  flag = 1
                }
              })
              if (flag == 0) {
                let obj = {}
                if(this.UTCEnable) {
                  obj['datetime'] = moment.utc(tableData.D).local().format(this.timeFormat)
                } else {
                  obj['datetime'] = moment(tableData.D).format(this.timeFormat)
                }
                obj['D'] = tableData.D
                obj[tableData.T] =  isNaN(tableData['V']) ? tableData['V'] : Number(tableData.V).toFixed(this.decimalPoint)
                queryProperty['chartDataSource'].push(obj)
              }
              let obj = {}
              queryProperty['displayfields'].forEach(field => {
                if (field == 'Name') {
                  obj['Name'] = tableData['T']
                } else if (field == 'Value') {
                  obj['Value'] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData['V']).toFixed(this.decimalPoint)
                } else if (field == 'TimeStamp') {
                  if(this.UTCEnable) {
                    obj['TimeStamp'] = moment.utc(tableData['D']).local().format(this.timeFormat)
                  } else {
                    obj['TimeStamp'] = moment(tableData['D']).format(this.timeFormat)
                  }
                } else if (field == 'Quality') {
                  obj['Quality'] = tableData['Q']
                } else if (field == 'Description') {
                  obj['Description'] = tableData['M']
                }
              })
              tempArray.push(obj)
            }))
            queryProperty['tableDataSource'] = tempArray
          })
        }
       
      }
      if (queryProperty['processFor'] == 'realtime') {
        queryProperty['times'] = ''
        let time;
        if (queryProperty['startFresh']) {
          // time = (moment().utc().valueOf() * 10000) + 116444736000000000
          time = moment.utc().valueOf();
        } else {
          // time = (moment().subtract(1, 'minutes').utc().valueOf() * 10000) + 116444736000000000
          time = moment().subtract(1, 'minutes').utc().valueOf();
        }  
        queryProperty['tags'].forEach((tag, index) => {
          if (index == 0) {
            console.log("if--------------------------", tag,time);
            queryProperty['times'] = time
          } else {
            console.log("else--------------------------", tag,time);
            queryProperty['times'] = queryProperty['times'] + ',' + time
          }
        })
        this.chartConstruct(queryProperty)
        this.gridConstruct(queryProperty)
        this.subscription.add(interval(5000).subscribe(x => {
          if(queryProperty['chartDataSource'].length != 0) {
            // time = queryProperty['chartDataSource'][queryProperty['chartDataSource'].length - 1]['U']
            if(queryProperty['chartDataSource'][queryProperty['chartDataSource'].length - 1]['U']){
              time = queryProperty['chartDataSource'][queryProperty['chartDataSource'].length - 1]['U']
            }
            else{
              // time = (moment().subtract(1, 'minutes').utc().valueOf() * 10000) + 116444736000000000
              time = moment().subtract(1, 'minutes').utc().valueOf();
            }
            queryProperty['times'] = ''
            queryProperty['tags'].forEach((tag, index) => {
              if(index == 0) {
                queryProperty['times'] = time
              } else {
                queryProperty['times'] = queryProperty['times'] + ',' + time
              } 
            })
          }
          this.chartConstruct(queryProperty)
          if(queryProperty['tableDataSource'].length != 0) {
            time = queryProperty['tableDataSource'][queryProperty['tableDataSource'].length - 1]['U']
            queryProperty['times'] = ''
            queryProperty['tags'].forEach((tag, index) => {
              if(index == 0) {
                queryProperty['times'] = time
              } else {
                queryProperty['times'] = queryProperty['times'] + ',' + time
              } 
            })
          }
          this.gridConstruct(queryProperty)
        }))
      }
      console.log("queryProperty", queryProperty)
      this.queryProperty = queryProperty
    }
  }

  chartConstruct(queryProperty) {
    console.log("queryProperty",queryProperty);
    console.log("times checking", queryProperty['times'])
    this.pageService.GetOPCValuesByTagsTime({tagNames: queryProperty['tagNames'], utcTimes: queryProperty['times']}).subscribe((responseFormData: any) => {
      JSON.parse(responseFormData).forEach((data=> {
        if(queryProperty['zoom'] == false) {
          queryProperty['chartDataSource'] = queryProperty['predataSource']
          let flag = 0
          queryProperty['chartDataSource'].forEach(tempData => {
            if(data.U == tempData.U) {
              tempData['datetime'] = this.getValue(data.U)
              tempData['U'] = data.U
              tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
              flag = 1
            }
          })
          if(flag == 0) {
            let obj = {}
            obj['datetime'] = this.getValue(data.U)
            obj['U'] = data.U
            obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
            queryProperty['chartDataSource'].push(obj)
          }
          // console.log(queryProperty['chartDataSource']);
          if(queryProperty['showData'] == 'points') {
            if (queryProperty['chartDataSource'].length > queryProperty['lastData'] * 2) {
              // data['dataSource'] = []
              queryProperty['chartDataSource'] = queryProperty['chartDataSource'].slice(queryProperty['chartDataSource'].length - queryProperty['lastData'] * 2, queryProperty['chartDataSource'].length)
              console.log("trim", queryProperty['chartDataSource'])
            }
          } else if(queryProperty['showData'] == 'minutes') {
            queryProperty['chartDataSource'] = queryProperty['chartDataSource'].filter(data => moment().subtract(queryProperty['lastData'], 'minutes').isSameOrBefore(moment(data.datetime, this.timeFormat)))
          }
        } else {
          queryProperty['predataSource'] = JSON.parse(JSON.stringify(queryProperty['chartDataSource']))
          let flag = 0
          queryProperty['predataSource'].forEach(tempData => {
            if(data.U == tempData.U) {
              tempData['datetime'] = this.getValue(data.U)
              tempData['U'] = data.U
              tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
              flag = 1
            }
          })
          if(flag == 0) {
            let obj = {}
            obj['datetime'] = this.getValue(data.U)
            obj['U'] = data.U
            obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
            queryProperty['predataSource'].push(obj)
          }
        }
      }))
      // console.log("temp array chart", data['dataSource'])
    })
  }

  gridConstruct(queryProperty) {
    this.pageService.GetOPCValue({tagNames: queryProperty['tagNames']}).subscribe((responseFormData: any) => {

      //console.log("responseFormData", responseFormData)
      let tempArray = []
      JSON.parse(responseFormData).forEach(tableData => {
        if(queryProperty['zoom'] == false) {
          queryProperty['tableDataSource'] = queryProperty['pretableDataSource']
        } else {
          queryProperty['pretableDataSource'] = JSON.parse(JSON.stringify(queryProperty['tableDataSource']))
        }
        let obj = {}
        queryProperty['displayfields'].forEach(field => {
          if(field == 'Name') {
            obj['Name'] = tableData['T']
          } else if(field == 'Value') {
            obj['Value'] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData['V']).toFixed(this.decimalPoint)
          } else if(field == 'TimeStamp') {
            obj['TimeStamp'] =  this.getValue(tableData['U'])
          } else if(field == 'Quality') {
            obj['Quality'] = tableData['Q']
          } else if (field == 'Description') {
            obj['Description'] = tableData['M']
          }
        })
        tempArray.push(obj)
      })
      if(queryProperty['zoom'] == false) {
        queryProperty['tableDataSource'] = tempArray
      } else {
        queryProperty['pretableDataSource'] = tempArray
      }
      //console.log("get by id page data", this.controlProperties);
    })
  }

  getValue(value) {
    var tmp1 = (value - 116444736000000000) / 10000;
    if(this.UTCEnable) {
      return moment.utc("/Date(" + tmp1 + ")/").local().format(this.timeFormat);
    } else {
      return moment("/Date(" + tmp1 + ")/").format(this.timeFormat);
    }
  }

  ngOnDestroy() {
    // console.log("destroy")
    // this.subscription.unsubscribe()
  }

  doRefresh(event) {
    this.subscription.unsubscribe()
    this.subscription = new Subscription()
    this.constructData()
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  pause(data) {
    data['zoom'] = true;
  }

  play(data) {
    data['zoom'] = false;
  }

  async openModalControl(data, value) {
    data['type'] = value
    data['cat'] = 'query';
    console.log("modal control", data)
    const modal = await this.modalController.create({
      component: SingleViewControlComponent,
      componentProps: {
        data: data,
      }
    });
    modal.onDidDismiss().then((submitData) => {
      console.log("grid dismiss data", submitData)
      this.screenOrientation.unlock();
    })
    return await modal.present();
  }
}
