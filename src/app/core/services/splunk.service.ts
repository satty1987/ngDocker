import { Injectable } from '@angular/core';
import { HttpRequest, HttpHeaders } from '@angular/common/http';
import { SPLUNK_LOG_URL_IGNORE_LIST } from '../constants/common.constants';
import { NgxLoggerLevel, NGXLogger } from 'ngx-logger';

@Injectable({
    providedIn: 'root'
  })
export class SplunkUtilityService {

    constructor(private logger: NGXLogger) { }



  public  logInSplunk(logLevel: NgxLoggerLevel, req: HttpRequest<any>, message: any) {
        const urlProps = this._prepareUrlProperties(req);
        this.logger.setCustomHttpHeaders(new HttpHeaders({
            ['metaData']:
            JSON.stringify({ hideLoaderIcon: true, lowPriority: true })
        }));
        message = {
            ...message, requestBody: req.body, api: urlProps['apiName'] || ''
        };
            switch (logLevel) {
                case NgxLoggerLevel.ERROR:
                    this.logger.error(message);
                    break;
                case NgxLoggerLevel.LOG:
                    this.logger.log(message);
                    break;
                default:
                    this.logger.error(message);
            }
        
    }
    private _prepareUrlProperties(req: HttpRequest<any>) {
        let urlProperties = {};

        if (req.params) {
            urlProperties = req.params.get('metaData');
            req.params.delete('metaData');
        }
        if (req.headers) {
            const metaData = JSON.parse(req.headers.get('metadata') || '{}');
            urlProperties = { ...urlProperties, ...metaData };
        }
        return urlProperties;
    }
}
