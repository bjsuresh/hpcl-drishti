import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PagesService } from '../pages/pages.service'
import { interval, Subscription } from 'rxjs';
import { SingleViewControlComponent } from '../single-view-control/single-view-control.component'
import * as moment from 'moment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { utc } from 'moment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-viewcontrols',
  templateUrl: './viewcontrols.component.html',
  styleUrls: ['./viewcontrols.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewcontrolsComponent implements OnInit {
  UTCEnable=environment.utc
  @Input() id: any;
  decimalPoint = 2;
  controlProperties: any = {};
  subscription = new Subscription();
  timeFormat = 'YYYY/MM/DD HH:mm';
  fileTransfer: FileTransferObject = this.transfer.create();
  role: any;
  indicatorfields = ["Alias Name", "Tag Name", "Condition"];
  operators = {
    '>': function(a, b) { return a > b },
    '<': function(a, b) { return a < b },
    '>=': function(a, b) { return a < b },
    '<=': function(a, b) { return a < b },
    '=': function(a, b) { return a < b },
  };
  constructor(private screenOrientation: ScreenOrientation, private transfer: FileTransfer, private file: File, public modalController: ModalController, private pageService: PagesService) { }

  ngOnInit() {
    this.role = localStorage.getItem('AdminType')
    if(localStorage.getItem('noOfDecimal')) {
      this.decimalPoint = Number(localStorage.getItem('noOfDecimal'))
    }
    if(localStorage.getItem('timeFormat')) {
      this.timeFormat = localStorage.getItem('timeFormat')
    } else {
      this.timeFormat = 'YYYY/MM/DD HH:mm'
    }
    this.pageService.getByIdPageDetails(this.id).subscribe((data: any) => {
      this.controlProperties = JSON.parse(data)
      console.log("controlProperties", this.controlProperties)
      if (this.controlProperties['pageproperties'] == 'undefined' || this.controlProperties['pageproperties'] == null) {
        this.controlProperties['pageproperties'] = []
      } else {
        this.controlProperties['pageproperties'] = JSON.parse(this.controlProperties['pageproperties'])
      }
      this.controlProperties['pageproperties'].forEach((data) => {
        console.log(data)
        if (data.type == "indicator") {
          data['data']['tags'] = data.data.data.map(data => data['tag'])
        }
        if (data.type == "chart") {
          data['dataSource'] = []
          data['predataSource'] = []
          data['zoom'] = false;
        }
        data['tagNames'] = ''
        data['tagNames'] = ''
        if (data['data'] && Array.isArray(data['data']['tags'])) {
          data['tagNames'] = data['data']['tags'].join(',');
        }

        else {
          data['tagNames'] = 10
        }
        if (data.type == "chart") {
          data['times'] = ''
          let time;
          if (data['data']['startFresh']) {
            time = (moment().utc().valueOf() * 10000) + 116444736000000000
          } else {
            time = (moment().subtract(1, 'minutes').utc().valueOf() * 10000) + 116444736000000000
          }
          data['data']['tags'].forEach((tag, index) => {
            if (index == 0) {
              console.log("--------------------------", time)
              data['times'] = time
            } else {
              data['times'] = data['times'] + ',' + time
            }
          })
        }
        //console.log("tagNames", data);
        if (data.data.processFor == "query") {
          if (data.type == "grid") {
            this.gridQueryConstruct(data)
          } else if (data.type == "chart") {
            this.chartQueryConstruct(data)
          }
        } else {
          if (data.type == "grid") {
            this.gridConstruct(data)
          } else if (data.type == "circulargauge") {
            this.cirCulargaugeConstruct(data)
          } else if (data.type == "lineargauge") {
            this.linearGaugeConstruct(data)
          } else if (data.type == "bargauge") {
            this.barGaugeConstruct(data)
          } else if (data.type == "chart") {
            this.chartConstruct(data)
          } else if (data.type == "indicator") {
            this.indicatorConstruct(data)
          } 
          this.subscription.add(interval(this.controlProperties['RefreshRate'] * 1000).subscribe(x => {
            if (data.type == "grid") {
              this.gridConstruct(data)
            } else if (data.type == "circulargauge") {
              this.cirCulargaugeConstruct(data)
            } else if (data.type == "lineargauge") {
              this.linearGaugeConstruct(data)
            } else if (data.type == "bargauge") {
              this.barGaugeConstruct(data)
            } else if (data.type == "indicator") {
              this.indicatorConstruct(data)
            }
            else if (data.type == "chart") {
              if (data['dataSource'].length != 0) {
                let time = data['dataSource'][data['dataSource'].length - 1]['U']
                data['times'] = ''
                data['data']['tags'].forEach((tag, index) => {
                  if (index == 0) {
                    data['times'] = time
                  } else {
                    data['times'] = data['times'] + ',' + time
                  }
                })
              }
              this.chartConstruct(data)
            }
          }))
        }

      })

    })
  }

  // enterFullScreen() {
  //   console.log("----")
  // }

  gridConstruct(data) {
    this.pageService.GetOPCValue({ tagNames: data['tagNames'] }).subscribe((responseFormData: any) => {
      //console.log("responseFormData", responseFormData)
      let tempArray = []
      JSON.parse(responseFormData).forEach(tableData => {
        let obj = {}
        data['data']['displayfields'].forEach(field => {
          if (field == 'Name') {
            obj['Name'] = tableData['T']
          } else if (field == 'Value') {
            obj['Value'] = isNaN(tableData['V']) ? tableData['V'] : Number(tableData['V']).toFixed(this.decimalPoint)
          } else if (field == 'TimeStamp') {
            obj['TimeStamp'] = this.getValue(tableData['U'])
          } else if (field == 'Quality') {
            obj['Quality'] = tableData['Q']
          } else if (field == 'Description') {
            obj['Description'] = tableData['M']
          }
        })
        tempArray.push(obj)
      })
      data['dataSource'] = tempArray
      //console.log("get by id page data", this.controlProperties);
    })
  }

  indicatorConstruct(data) {
    this.pageService.GetOPCValue({ tagNames: data['tagNames'] }).subscribe((responseFormData: any) => {
      console.log("responseFormData", responseFormData, data)
      responseFormData = JSON.parse(responseFormData)
      data['dataSource'] = data['data']['data'].map((conData, index) => {
        let obj = {}
        obj['Alias Name'] = conData['aliasName']
        obj['Tag Name'] = conData['tag']
        let conCorData = []
        // conData['condition'].forEach(condition => {
        //   console.log(condition['symbol'], responseFormData[index]['V'], condition['value'])
        //   console.log(this.operators[condition['symbol']](responseFormData[index]['V'], condition['value']))
        //   if(this.operators[condition['symbol']](responseFormData[index]['V'], condition['value'])) {
        //     conCorData.push(condition)
        //   }
        // })
        // console.log(conCorData)
        // obj['Condition'] = conCorData.length == 0?null:conCorData[0].color
        // console.log(responseFormData[index]['V'] , conData['condition'][0].color, conData['condition'][1].color)
        if(conData['optionValue'] == '0' ? responseFormData[index]['V'] == "FALSE" : responseFormData[index]['V'] == 0) {
          obj['Condition'] = conData['condition'][0].color
        } else if(conData['optionValue'] == '0' ? responseFormData[index]['V'] == "TRUE" : responseFormData[index]['V'] == 1) {
          obj['Condition'] = conData['condition'][1].color
        } else {
          obj['Condition'] = '#000000'
        }
        console.log("final obj", obj)
        return obj
      })
      console.log(data)
    })
  }

  chartQueryConstruct(chartData) {
    let from;
    let to
    // if (chartData.data.hasOwnProperty('lastnndays')) {
    //   from = moment().subtract(chartData.data.lastnndays, 'days').format('YYYY-MM-DD HH:mm')
    //   to = moment().format('YYYY-MM-DD HH:mm')
    // } else {
      console.log("chartData", chartData)
      if (this.UTCEnable){
        from = moment(moment(chartData.data.from).format('YYYY-MMM-DD') + ' ' + moment(chartData.data.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')
        to = moment(moment(chartData.data.to).format('YYYY-MMM-DD') + ' ' + moment(chartData.data.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')  
      } else {
        from = moment(moment(chartData.data.from).format('YYYY-MMM-DD') + ' ' + moment(chartData.data.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')
        to = moment(moment(chartData.data.to).format('YYYY-MMM-DD') + ' ' + moment(chartData.data.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')  
      }
    // }
    console.log(`from ${from} to ${to}`)
    if (chartData.data.readFor == 'process') {
      let aggerate;
      let interval;
      chartData['data']['tags'].forEach((tag, index) => {
        if (index == 0) {
          aggerate = chartData.data.operations
        } else {
          aggerate = chartData.data.operations + ',' + aggerate
        }
      })
      if (chartData.data.interval) {
        interval = Math.round(moment(to, 'YYYY-MMM-DD HH:mm:ss').diff(moment(from, 'YYYY-MMM-DD HH:mm:ss'), 'seconds') / chartData.data.interval)
      } 
      // else if (chartData.data.interval == 'hours') {
      //   interval = chartData.data.hours * 3600
      // } else {
      //   interval = chartData.data.days * 86400
      // }
      this.pageService.GetReadProcessed({ tagNames: chartData['tagNames'], from: from, to: to, aggerate: aggerate, 
        sampleIntervalValue: chartData['data']['interval'],
        sampleIntervalType: chartData['data']['intervalType']  
      }).subscribe((responseFormData: any) => {
        JSON.parse(responseFormData).forEach((data => {
          let flag = 0
          chartData['dataSource'].forEach(tempData => {
            if (data.D == tempData.D) {
              if(this.UTCEnable) {
                tempData['datetime'] = moment.utc(data.D).local().format(this.timeFormat)
              } else {
                tempData['datetime'] = moment(data.D).format(this.timeFormat)
              }
              tempData['D'] = data.D
              tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
              flag = 1
            }
          })
          if (flag == 0) {
            let obj = {}
            if(this.UTCEnable) {
              obj['datetime'] = moment.utc(data.D).local().format(this.timeFormat)
            } else {
              obj['datetime'] = moment(data.D).format(this.timeFormat)
            }
            obj['D'] = data.D
            obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
            chartData['dataSource'].push(obj)
          }
        }))
        //console.log("dataSource", chartData['dataSource'])
      })
    } else {
      this.pageService.GetReadRawValues({ tagNames: chartData['tagNames'], from: from, to: to, row: chartData.data.maxRows }).subscribe((responseFormData: any) => {
        JSON.parse(responseFormData).forEach((data => {
          let flag = 0
          chartData['dataSource'].forEach(tempData => {
            if (data.D == tempData.D) {
              if(this.UTCEnable) {
                tempData['datetime'] =  moment.utc(data.D).local().format(this.timeFormat)
              } else {
                tempData['datetime'] =  moment(data.D).format(this.timeFormat)
              }
              tempData['D'] = data.D
              tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
              flag = 1
            }
          })
          if (flag == 0) {
            let obj = {}
            if(this.UTCEnable) {
              obj['datetime'] =  moment.utc(data.D).local().format(this.timeFormat)
            } else {
              obj['datetime'] =  moment(data.D).format(this.timeFormat)
            }
            obj['D'] = data.D
            obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
            chartData['dataSource'].push(obj)
          }
        }))
      })
    }

  }

  gridQueryConstruct(data) {
    let from;
    let to
    // if (data.data.hasOwnProperty('lastnndays')) {
    //   from = moment().subtract(data.data.lastnndays, 'days').format('YYYY-MM-DD HH:mm')
    //   to = moment().format('YYYY-MM-DD HH:mm')
    // } else {
      if(this.UTCEnable) {
        from = moment(moment(data.data.from).format('YYYY-MMM-DD') + ' ' + moment(data.data.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')
        to = moment(moment(data.data.to).format('YYYY-MMM-DD') + ' ' + moment(data.data.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').utc().format('YYYY-MMM-DD HH:mm:ss')
      } else {
        from = moment(moment(data.data.from).format('YYYY-MMM-DD') + ' ' + moment(data.data.fromTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')
        to = moment(moment(data.data.to).format('YYYY-MMM-DD') + ' ' + moment(data.data.toTime).format('HH:mm:ss'), 'YYYY-MMM-DD HH:mm:ss').format('YYYY-MMM-DD HH:mm:ss')
      }
        // }
    if (data.data.readFor == 'process') {
      let aggerate;
      let interval;
      data['data']['tags'].forEach((tag, index) => {
        if (index == 0) {
          aggerate = data.data.operations
        } else {
          aggerate = data.data.operations + ',' + aggerate
        }
      })
      if (data.data.interval) {
        interval = moment(to, 'YYYY-MMM-DD HH:mm:ss').diff(moment(from, 'YYYY-MMM-DD HH:mm:ss'), 'seconds') / data.data.interval
      } 
      // if (data.data.interval == 'minutes') {
      //   interval = data.data.minutes * 60
      // } else if (data.data.interval == 'hours') {
      //   interval = data.data.hours * 3600
      // } else {
      //   interval = data.data.days * 86400
      // }
      this.pageService.GetReadProcessed({ tagNames: data['tagNames'], from: from, to: to, aggerate: aggerate, 
      sampleIntervalValue: data['data']['interval'],
      sampleIntervalType: data['data']['intervalType']   }).subscribe((responseFormData: any) => {
        let tempArray = []
        JSON.parse(responseFormData).forEach(tableData => {
          let obj = {}
          data['data']['displayfields'].forEach(field => {
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
        })
        data['dataSource'] = tempArray
      })
    } else {
      //console.log(`from ${from} to ${to}`)
      this.pageService.GetReadRawValues({ tagNames: data['tagNames'], from: from, to: to, row: data.data.maxRows }).subscribe((responseFormData: any) => {
        //console.log("responseFormData to gridQueryConstruct", responseFormData)
        let tempArray = []
        JSON.parse(responseFormData).forEach(tableData => {
          let obj = {}
          data['data']['displayfields'].forEach(field => {
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
        })
        data['dataSource'] = tempArray
      })
    }

  }

  cirCulargaugeConstruct(data) {
    this.pageService.GetOPCValue({ tagNames: data['tagNames'] }).subscribe((responseFormData: any) => {
      // console.log("responseFormData to cirCulargaug", responseFormData)
      data['gaugeVaue'] = Number(JSON.parse(responseFormData)[0].V).toFixed(this.decimalPoint)
    })
  }

  linearGaugeConstruct(data) {
    this.pageService.GetOPCValue({ tagNames: data['tagNames'] }).subscribe((responseFormData: any) => {
      data['gaugeVaue'] = Number(JSON.parse(responseFormData)[0].V).toFixed(this.decimalPoint)
    })
  }

  chartConstruct(chartData) {
    console.log("times checking", chartData,chartData['times'])
    this.pageService.GetOPCValuesByTagsTime({ tagNames: chartData['tagNames'], utcTimes: chartData['times'] }).subscribe((responseFormData: any) => {
      if (JSON.parse(responseFormData).length != 0) {
        JSON.parse(responseFormData).forEach((data => {
          if (chartData['zoom'] == false) {
            chartData['dataSource'] = chartData['predataSource']
            let flag = 0
            console.log("------", chartData['dataSource'])
            chartData['dataSource'].forEach(tempData => {
              if (data.U == tempData.U) {
                tempData['datetime'] = this.getValue(data.U)
                tempData['U'] = data.U
                tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
                flag = 1
              }
            })
            if (flag == 0) {
              let obj = {}
              obj['datetime'] = this.getValue(data.U)
              obj['U'] = data.U
              obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
              chartData['dataSource'].push(obj)
            }
            if(chartData['data']['showData'] == 'points') {
              if (chartData['dataSource'].length > chartData['data']['lastData'] * 2) {
                // data['dataSource'] = []
                chartData['dataSource'] = chartData['dataSource'].slice(chartData['dataSource'].length - chartData['data']['lastData'] * 2, chartData['dataSource'].length)
                console.log("trim", chartData['dataSource'])
              }
            } else if(chartData['data']['showData'] == 'minutes') {
              chartData['dataSource'] = chartData['dataSource'].filter(data => moment().subtract(chartData['data']['lastData'], 'minutes').isSameOrBefore(moment(data.datetime, 'YYYY-MM-DD HH:mm:ss:SSS')))
            }
          } else {
            chartData['predataSource'] = JSON.parse(JSON.stringify(chartData['dataSource']))
            let flag = 0
            chartData['predataSource'].forEach(tempData => {
              if (data.U == tempData.U) {
                tempData['datetime'] = this.getValue(data.U)
                tempData['U'] = data.U
                tempData[data.T] = Number(data.V).toFixed(this.decimalPoint)
                flag = 1
              }
            })
            if (flag == 0) {
              let obj = {}
              obj['datetime'] = this.getValue(data.U)
              obj['U'] = data.U
              obj[data.T] = Number(data.V).toFixed(this.decimalPoint)
              chartData['predataSource'].push(obj)
            }
          }
        }))
        //console.log("temp array chart", chartData['dataSource'])
      }
    })
  }

  barGaugeConstruct(data) {
    this.pageService.GetOPCValue({ tagNames: data['tagNames'] }).subscribe((responseFormData: any) => {
      let tempArray = []
      // console.log("responseFormData", responseFormData)
      JSON.parse(responseFormData).forEach(tableData => {
        tempArray.push(Number(tableData['V']).toFixed(this.decimalPoint))
      })
      data['dataSource'] = tempArray
    })
  }

  dismissModal() {
    this.modalController.dismiss('', 'cancel')
  }

  onExporting(event) {
    //console.loconsole.log("onExporting ---------", event)
    this.fileTransfer.download('https://uidai.gov.in/images/commdoc/valid_documents_list.pdf', 'name').then((entry) => {
      //console.log('download complete: ' + entry.toURL());
    }, (error) => {
      //console.log("error", error)
    });
  }

  customizeTooltip = (arg) => {
    //console.log("arg ------------", arg)
    return {
      text: arg.value
    };
  }

  customizeText = (arg) => {
    //console.log("arg ++++++++++", arg)
    return 'dasdas';
  }

  onExported(event) {
    //console.log("onExported ---------", event)
    // const url = 'https://uidai.gov.in/images/commdoc/valid_documents_list.pdf';
    // this.fileTransfer.download(event.data, this.file.dataDirectory + 'file.pdf').then((entry) => {
    // console.log('download complete: ' + entry.toURL());
    // }, (error) => {
    //   console.log('Error: ' + error);
    // });
  }

  onFileSaving(event) {
    console.log("onFileSaving ---------", event)
  }

  ngOnDestroy() {
    console.log("destroy")
    this.subscription.unsubscribe()
  }

  async openModalControl(data) {
    //console.log("modal control", data)
    data['cat'] = 'page';
    const modal = await this.modalController.create({
      component: SingleViewControlComponent,
      componentProps: {
        data: data,
      }
    });
    modal.onDidDismiss().then((submitData) => {
      //console.log("grid dismiss data", submitData)
      this.screenOrientation.unlock();
    })
    return await modal.present();
  }

  getValue(value) {
    var tmp1 = (value - 116444736000000000) / 10000;
    if(this.UTCEnable) {
      
      return moment.utc("/Date(" + tmp1 + ")/").local().format(this.timeFormat);
    } else {
      return moment("/Date(" + tmp1 + ")/").format(this.timeFormat);
    }

  }

  getFloatValue(number) {
    if(Number.isInteger(number)) {
      return number
    } else {
      return Number(number.toFixed(2))
    } 
  }

  pause(data) {
    data['zoom'] = true;
  }

  play(data) {
    data['zoom'] = false;
  }

  doRefresh(event) {
    this.subscription.unsubscribe()
    this.subscription = new Subscription()
    this.ngOnInit()
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
