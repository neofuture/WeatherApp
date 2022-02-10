import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  call(url, requestType, body): any {
    const httpOptions = this.headers();
    let data;
    if (requestType === 'get' || requestType === 'delete') {
      const params = new URLSearchParams(body).toString();
      data = this.http[requestType](url + (params ? '/?' + params : ''), httpOptions);
    } else {
      data = this.http[requestType](url, body, httpOptions);
    }
    return data;
  }

  headers(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }
}
