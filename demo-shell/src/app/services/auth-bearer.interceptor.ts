/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import {
  HttpHandler, HttpInterceptor, HttpRequest,
  HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent
} from '@angular/common/http';
import { AuthenticationService } from '@alfresco/adf-core';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthBearerInterceptor implements HttpInterceptor {
  private excludedUrlsRegex: RegExp[];
  private authService: AuthenticationService;

  constructor(private injector: Injector) { }

  private loadExcludedUrlsRegex(): void {
    const excludedUrls: string[] = this.authService.getBearerExcludedUrls();
    this.excludedUrlsRegex = excludedUrls.map((urlPattern) => new RegExp(urlPattern, 'gi')) || [];

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    this.authService = this.injector.get(AuthenticationService);

    if (!this.authService || !this.authService.getBearerExcludedUrls()) {
      return next.handle(req);
    }

    if (!this.excludedUrlsRegex) {
      this.loadExcludedUrlsRegex();
    }

    const urlRequest = req.url;
    const shallPass: boolean = !!this.excludedUrlsRegex.find((regex) => regex.test(urlRequest));
    if (shallPass) {
      return next.handle(req)
        .pipe(
          catchError((error) => {
            return observableThrowError(error);
          })
        );
    }

    return this.authService.addTokenToHeader(req.headers)
      .pipe(
        mergeMap((headersWithBearer) => {
        const kcReq = req.clone({ headers: headersWithBearer });
        return next.handle(kcReq)
          .pipe(
            catchError((error) => {
                return observableThrowError(error);
            })
          );
      })
      );
  }
}
