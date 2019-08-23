import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  apiURL: string = 'http://localhost:8000/api/v1/';

  getHttpParams = (params: Array<any>): HttpParams => {
    let res = new HttpParams();
  
    for (const item of params)
      res = res.append(item.key, item.value);
  
    return res;
  };

  getHttpHeaders = (): HttpHeaders => {
    let headers = new HttpHeaders();

      // headers  = headers.append('header-1', 'value-1');
      // headers  = headers.append('header-2', 'value-2');

      return headers;
  }

  private errorCallback = (error, fullError = false) => {

    let messageInline = (messageTmp) => {
      let message = [];
      if (typeof messageTmp == 'object') {
        for (let key in messageTmp) {
          message.push(messageInline(messageTmp[key]));
        }
      } else if (Array.isArray(messageTmp)) {
        for (let i = 0; i < messageTmp.length; i++) {
          message.push(messageInline(messageTmp[i]));
        }

      } else {
        message.push(messageTmp);
      }
      return message.join('<br/>');
    }

    let message_to_send:any = "";
    try {
      if (error instanceof HttpErrorResponse) {
        if (error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          message_to_send = error.error.errors;
        } else if (error.error.errors && error.error.errors instanceof Object && Object.keys(error.error.errors).length > 0) {
          message_to_send = error.error.errors;
        } else {
          message_to_send = error.error.message || "Server Error";
        }
      } else {
        message_to_send = error || "Server Error";
      }


    } catch (err) {
      message_to_send = error || "Server Error";
    }
    
    let message;
    if (error.status == 503) {
      message = error;
    }else{
      message = messageInline(message_to_send);
    }
    

    this.manageErrors(error.status, message);

    return Observable.throw(fullError ? { message: message, error: {
      errors: error.error.errors,
      message: error.error.message,
      status: error.status,
      errorCode: error['error'] && error['error']['errorCode'] ? error['error']['errorCode'] : null,
      errorReference: error['error'] && error['error']['errorReference'] ? error['error']['errorReference'] : null
    } } : message);
  }

  private manageErrors = (status, message = null) => {
    // if (status == 401) {
    //   this.authenticateService.logout();

    //   if (this.location.path().split('?').shift() != "/login") {
    //     window.location.reload();
    //   }
    // }
    // if (status == 403 || status == 500) {
    //   if (message != null) {
    //     this.messagesService.showSnack(message, "error");
    //   }
    // }

    // if (status == 503) {
    //   this.router.navigate(['/maintenance']);
    // }
  }

  getData(endpoint, requestParams): Observable<Response | Object> {
    const httpParams = this.getHttpParams(requestParams),
          httpHeader = this.getHttpHeaders();

    return this.http.get(this.apiURL + endpoint, { headers: httpHeader,params: httpParams })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorCallback(error);
        }
      ));
  }

  saveData(endpoint, body): Observable<Response | Object> {
    const httpHeader = this.getHttpHeaders();

    return this.http.put(this.apiURL + endpoint, body, {headers: httpHeader})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorCallback(error);
      }
    ));
  }

  deleteData(endpoint, requestParams): Observable<Response | Object> {
    const httpParams = this.getHttpParams(requestParams),
          httpHeader = this.getHttpHeaders();

    return this.http.delete(this.apiURL + endpoint, { headers: httpHeader,params: httpParams })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorCallback(error);
      }
    ));
  }

  postData(endpoint, body): Observable<Response | Object> {
    const httpHeader = this.getHttpHeaders();
    
    return this.http.post(this.apiURL + endpoint, body, {headers: httpHeader})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorCallback(error);
      }
    ));
  }

  patchData(endpoint, body): Observable<Response | Object> {
    const httpHeader = this.getHttpHeaders();

    return this.http.patch(this.apiURL + endpoint, body, {headers: httpHeader})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorCallback(error);
      }
    ));
  }
}
