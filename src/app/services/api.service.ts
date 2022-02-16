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
    /*
    Generate the request headers, we could use an intereptor for this for adding things like
    bearer tokens
     */
    const httpOptions = this.headers();
    let data;
    /*
    Handle the verb in two different ways.
     */
    if (requestType === 'get' || requestType === 'delete') {
      /*
      GET and DETELE requests have no body content so the request
      is sent as URL Parameters
      */
      const params = new URLSearchParams(body).toString();
      data = this.http[requestType](url + (params ? '?' + params : ''), httpOptions);
    } else {
      /*
      All other verbs require the request to be in the body for best practice, Some API's
      May also use URL parameters, but I have not included these this for this example.
       */
      data = this.http[requestType](url, body, httpOptions);
    }
    /*
    pipe the error through an error handler, or return the Observable.
     */
    return data.pipe(
      catchError(err => {
        /*
        We have caught an error, so we send this to an error handler function
         */
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
        /*
        Example Header
         */
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

  This is an alternate way to handle errors, but the component
  has alternate error handling on the promise and subscription
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
