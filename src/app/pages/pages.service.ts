import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient) { }

  getAllPage() {
    let params = new HttpParams()
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetHierarchy', {params: params})
  }

  loginExternal() {
    return this.http.get('http://122.165.186.71:1221//Home/Login_external?username=admin&password=rq38ugbyyiQqfODPGDolMA==')
  }

  addPage(data) {
    let postObj = new Object()
    postObj['UserId'] = localStorage.getItem('UserId')
    postObj['PageName'] = data['PageName']
    postObj['PageType'] = data['pageType']
    postObj['MapType'] = data['MapType']
    postObj['MappingId'] = data['PlantAreaId']
    // postObj['PlantorArea'] = data['PlantorArea']
    postObj['PageProperties'] = data['PageProperties']
    postObj['RefreshRate'] = data['RefreshRate']
    postObj['PageAccessType'] = data['PageAccessType']
    return this.http.post(environment.apiUrl + 'AddNewpage', postObj)
  }

  deletePage(id) {
    let params = new HttpParams()
    params = params.append('PageId', id + '~' + localStorage.getItem('UserId'))
    return this.http.delete(environment.apiUrl + 'DeletePage', {params: params})
  }

  updatePage(pageData) {
    let postObj = new Object()
    postObj['UserId'] = localStorage.getItem('UserId')
    postObj['PageId'] = pageData.PageId
    postObj['PageName'] = pageData.PageName
    postObj['PageProperties'] = pageData.PageProperties
    postObj['PageType'] =  pageData.pageType
    postObj['RefreshRate'] = pageData.RefreshRate
    postObj['PageAccessType'] = pageData.PageAccessType
    return this.http.post(environment.apiUrl + 'SavePage', postObj)
  }

  updatePageProperties(pageData) {
    let postObj = new Object()
    postObj['PageId'] = pageData.pageid
    postObj['PageName'] = pageData.pagename
    postObj['PageProperties'] = pageData.pageproperties
    postObj['PageType'] = pageData.pageType
    postObj['RefreshRate'] = pageData.RefreshRate
    return this.http.post(environment.apiUrl + 'SavePage', postObj)
  }

  GetAppLicense() {
    return this.http.post(environment.apiUrl + 'GetAppLicense', {})
  }



  getByIdPageDetails(id) {
    let params = new HttpParams()
    params = params.append('PageId', id)
    return this.http.get(environment.apiUrl + 'GetPageProperties', {params: params})
  }

  GetTags() {
    let params = new HttpParams()
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetTags', {params: params})
  }


  GetTagsOnly(pageNumber, count, word) {
    let params = new HttpParams()
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    params = params.append('Keyword', word)
    params = params.append('PageNum', pageNumber)
    params = params.append('RecordCount', count)
    return this.http.get(environment.apiUrl + 'GetTagsOnly', {params: params})
  }

  GetOPCValue(data) {
    let params = new HttpParams()
    params = params.append('TagNames', data.tagNames)
    return this.http.get(environment.apiUrl + 'GetOPCValue', {params: params})
  }

  GetPlantsBySiteId(id) {
    let params = new HttpParams()
    params = params.append('SiteId', id)
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetUserPlantsBySiteId', {params: params})
  }

  GetAreasByPlantId(id) {
    let params = new HttpParams()
    params = params.append('PlantId', id)
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetUserAreasByPlantId', {params: params})
  }

  GetUnitsByAreaId(id) {
    let params = new HttpParams()
    params = params.append('AreaId', id)
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetUserUnitsByAreaId', {params: params})
  }

  GetSitesByEnterpriseId(id) {
    let params = new HttpParams()
    params = params.append('EnterpriseId', id)
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetUserSitesByEnterpriseId', {params: params})
  }

  GetOPCValuesByTagsTime(data) {
    let params = new HttpParams()
    params = params.append('TagNames', data.tagNames)
    params = params.append('UTCTimes', data.utcTimes)
    return this.http.get(environment.apiUrl + 'GetOPCValuesByTagsTime', {params: params})
  }

  GetReadRawValues(data) {
    let params = new HttpParams()
    params = params.append('TagNames', data.tagNames)
    params = params.append('StartTime', data.from)
    params = params.append('EndTime', data.to)
    params = params.append('MaxRows', data.row)
    return this.http.get(environment.apiUrl + 'ReadRawValues', {params: params})
  }

  GetReadProcessed(data) {
    let params = new HttpParams()
    params = params.append('TagNames', data.tagNames)
    params = params.append('StartTime', data.from)
    params = params.append('EndTime', data.to)
    params = params.append('Aggregates',data.aggerate)
    params = params.append('SampleIntervalValue',data.sampleIntervalValue)
    params = params.append('SampleIntervalType',data.sampleIntervalType)
    return this.http.get(environment.apiUrl + 'ReadProcessed', {params: params})
  }


  getAllReports() {
    let params = new HttpParams()
    params = params.append('UserId', localStorage.getItem('UserId'))
    params = params.append('GroupId', localStorage.getItem('GroupId'))
    return this.http.get(environment.apiUrl + 'GetReports', {params: params})
  }
  
  
  getFilePath() {
    let params = new HttpParams()
    params = params.append('path', 'F:\\\\REports\\\\Report1\\\\SAMA MP Form Design.xlsx')
    return this.http.get('http://122.165.186.71:20020/apis/GetFile', {params: params, responseType: 'arraybuffer'})
  }

  getFileStream(url) {
    let params = new HttpParams()
    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  GetAggreates() {
    return this.http.get(environment.apiUrl + 'GetAggreagates')
  }

}
