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
        console.error('Intercepted Error', error);
        return throwError(error);
    }));
  }
}
