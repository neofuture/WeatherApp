import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  /*
  function to call the API, which enables the use of all verbs and
  constructs the request correctly in each instance
   */
  call(url, requestType, body): Observable<HttpEvent<any>> {
    const httpOptions = this.headers();
    let data;
    if (requestType === 'get' || requestType === 'delete') {
      const params = new URLSearchParams(body).toString();
      data = this.http[requestType](url + (params ? '?' + params : ''), httpOptions);
    } else {
      data = this.http[requestType](url, body, httpOptions);
    }
    return data.pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  /*
  Construct the valid headers
   */
  headers(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }

  /*
  Error handling, if error is 500, 401, 405, 403 (for example)
  an error is handled and alerted to the end user, manufactured
  errors which should report to the UI are also handled and
  can be returned to the subscription so that any actions can
  be taken in the UI
   */
  handleError(error): any {
    if (error.status === 500 || error.status === 401 || error.status === 405 || error.status === 403 || error.status === 429) {
      alert('Error calling the API\n\nError: ' + error.statusText);
      return throwError(error);
    } else {
      return [{error}];
    }
  }
}
