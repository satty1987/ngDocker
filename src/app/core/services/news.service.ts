
import { Injectable } from '@angular/core';
import { API_URLS } from '../constants/api-urls';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    public responseCache = new Map();

    constructor(
        private http: HttpClient,
        private router: ActivatedRoute) {
    }

    getNewsSources() {

        const query = API_URLS.queryParms.apiKey;
        const sources = `${API_URLS.newsSources}apiKey=${query}`;

        return this.apiCacheRequest(sources);

    }
    getDetailNewsSources(src) {
        let sources = `https://newsapi.org/v2/top-headlines?sources={sources}&apiKey=${API_URLS.queryParms.apiKey}`;
        sources = sources.replace('{sources}', src);
        return this.apiCacheRequest(sources);
    }

     apiCacheRequest(url) {
        const cacheResponse = this.responseCache.get(url);
        if (cacheResponse) {
            return of(cacheResponse);
          }
          const response = this.http.get(url);
          response.subscribe(data => this.responseCache.set(url, data));
          return response;
     }
}

