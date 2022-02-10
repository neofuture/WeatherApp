import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CustomError} from '../models/custom-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        /* here we can add more error status, and handle conditions */
        if (error.status === 500 || error.status === 405 || error.status === 403) {
          /* Handle error internally */
          alert('Error ' + error.status);
          return throwError(error);
        } else {
          return [{status: error.status}];
        }
    }));
  }
}
