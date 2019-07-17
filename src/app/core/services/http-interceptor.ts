import {LoaderService} from './loader-service';
import { Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Observable, pipe , throwError} from 'rxjs';
import {SplunkUtilityService} from './splunk.service';
import { NgxLoggerLevel } from 'ngx-logger';
import { map, catchError} from 'rxjs/operators';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  private authReq: HttpRequest<any>;
  private loggerLoad: any;
  private LOG_LEVEL = ['TRACE', 'DEBUG', 'INFO', 'LOG', 'WARN', 'ERROR', 'FATAL', 'OFF'];
    constructor(private loaderService: LoaderService, public splunk: SplunkUtilityService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      this.authReq = req;
      // inject this method thorugh service
      if (req.url.indexOf('services/collector/event') !== -1) {
          this.authReq = this._mapLoggingPayload(req);
          return next.handle(this.authReq).pipe(
              map(event => {
                  return event;
              }),
              catchError(error => {
                  return throwError(error);
              }));

      }
      return next.handle(this.authReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
  
           this.splunk.logInSplunk(NgxLoggerLevel.LOG, req, event);

           return event;
          }
        })
      );;
  }
  _mapLoggingPayload(req: HttpRequest<any>): HttpRequest<any> {
    let apiName = '';
    
    this.authReq = req.clone({
      body: Object.assign({},
        {
          'event': {

           'name':'satnam',
           'type': 'singh'
          }
        }),
      setHeaders: { "Authorization": "Splunk 7cdfb086-aaf5-4fc0-b885-9824dce3bdb8" } 
    });
    return this.authReq;

  }
}