import {LoaderService} from './loader-service';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.showLoader();
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => { 
          if (event instanceof HttpResponse) {
            this.onEnd();

            const camelCaseObject = event.body;
            camelCaseObject.status = 'Success';
            const modEvent = event.clone({ body: camelCaseObject });

            return modEvent;
          }
        },
          (err: any) => {
            this.onEnd();
        }));
      }

    private onEnd(): void {
        this.hideLoader();
      }
      private showLoader(): void {
        this.loaderService.show();
      }
      private hideLoader(): void {
        this.loaderService.hide();
      }
}