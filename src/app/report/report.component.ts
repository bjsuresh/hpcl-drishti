import { Component, OnInit } from '@angular/core';
import { PagesService } from '../pages/pages.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  reportData = {}
  keys = []
  // fileTransfer: FileTransferObject = this.transfer.create();
  constructor(private pageService: PagesService, private file: File, public toastController: ToastController, private fileTransfer: FileTransfer
    , private fileOpener: FileOpener) { }

  ngOnInit() {
    // this.getAllReportApi()
  }

  ionViewDidEnter() {
    this.getAllReportApi()
  }

  doRefresh(event) {
    this.getAllReportApi()
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getAllReportApi() {
    this.pageService.getAllReports().subscribe((data: any) => {
      console.log("getAllPage data", JSON.parse(data))
      JSON.parse(data).forEach(parent => {
        if (parent.FileName == null) {
          this.reportData[parent.ReportName] = parent
          this.reportData[parent.ReportName]['child'] = []
        }
      })
      JSON.parse(data).forEach(child => {
        if (child.FileName != null) {
          this.reportData[child.ReportName]['child'].push(child)
        }
      })
      console.log(this.reportData)
      this.keys = Object.keys(this.reportData)
    })
  }

  reportDownload(fileObj) {
    console.log("download")
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    fileTransfer.download(localStorage.getItem('apiUrl') + '/apis/GetFile?path=' + fileObj['PhysicalPath'], this.file.dataDirectory +
    fileObj['FileName'], true, {
      headers: {
        Authorization: `bearer ${localStorage.getItem('token')}`,
      }
    }).then((res) => {
      console.log('respone file download', res);
      this.fileOpener.showOpenWithDialog(this.file.dataDirectory + fileObj['FileName'], 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }).catch(err => {
      console.log('error', err);
    })
    // this.pageService.getFileStream(localStorage.getItem('apiUrl') + '/apis/GetFile?path=' + fileObj['PhysicalPath']).subscribe((streamData) => {
    //   console.log('streamData', streamData)
    // })
    // window.open(localStorage.getItem('apiUrl') + '/apis/GetFile?path=' + fileObj['PhysicalPath'], '_blank')
    // this.pageService.getFilePath().subscribe(resFormApi => {
    //   console.log(resFormApi)
    //   let dir_name = 'Download'
    //   this.file.writeFile(this.file.externalRootDirectory + dir_name, fileObj['FileName'] + Date.now() + '.txt', resFormApi).then(ackFile => {
    //     console.log(ackFile)
    //     this.presentToast(fileObj['FileName'] + '.' + fileObj['FileExtension'] + ' file has been downloaded to the Downloads folder. View it..')
    //   })
    // })
  }


  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
