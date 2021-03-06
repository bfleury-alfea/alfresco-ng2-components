/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { SitePaging, SiteEntry, MinimalNode, SitesApi, SiteMembershipRequestWithPersonPaging } from '@alfresco/js-api';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SitesService {

    sitesApi: SitesApi;

    constructor(private apiService: AlfrescoApiService) {
        this.sitesApi = new SitesApi(apiService.getInstance());
    }

    /**
     * Gets a list of all sites in the repository.
     * @param opts Options supported by JS-API
     * @returns List of sites
     */
    getSites(opts: any = {}): Observable<SitePaging> {
        const defaultOptions = {
            skipCount: 0,
            include: ['properties']
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.sitesApi.listSites(queryOptions))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets the details for a site.
     * @param siteId ID of the target site
     * @param opts Options supported by JS-API
     * @returns Information about the site
     */
    getSite(siteId: string, opts?: any): Observable<SiteEntry | {}> {
        return from(this.sitesApi.getSite(siteId, opts))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Deletes a site.
     * @param siteId Site to delete
     * @param permanentFlag True: deletion is permanent; False: site is moved to the trash
     * @returns Null response notifying when the operation is complete
     */
    deleteSite(siteId: string, permanentFlag: boolean = true): Observable<any> {
        const options: any = {};
        options.permanent = permanentFlag;
        return from(this.sitesApi.deleteSite(siteId, options))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets a site's content.
     * @param siteId ID of the target site
     * @returns Site content
     */
    getSiteContent(siteId: string): Observable<SiteEntry | {}> {
        return this.getSite(siteId, { relations: ['containers'] });
    }

    /**
     * Gets a list of all a site's members.
     * @param siteId ID of the target site
     * @returns Site members
     */
    getSiteMembers(siteId: string): Observable<SiteEntry | {}> {
        return this.getSite(siteId, { relations: ['members'] });
    }

    /**
     * Gets the username of the user currently logged into ACS.
     * @returns Username string
     */
    getEcmCurrentLoggedUserName(): string {
        return this.apiService.getInstance().getEcmUsername();
    }

    /**
     * Looks for a site inside the path of a Node and returns its guid if it finds one.
     * (return an empty string if no site is found)
     * @param node Node to look for parent site
     * @returns Site guid
     */
    getSiteNameFromNodePath(node: MinimalNode): string {
        let siteName = '';
        if (node.path && node.path.elements) {
            const foundNode = node.path
                .elements.find((pathNode: MinimalNode) =>
                    pathNode.nodeType === 'st:site' &&
                    pathNode.name !== 'Sites');
            siteName = foundNode ? foundNode.name : '';
        }
        return siteName.toLocaleLowerCase();
    }

    /**
     * Gets a list of site membership requests.
     * @param opts Options supported by JS-API
     * @returns Site membership requests
     */
    getSiteMembershipRequests(opts?: any): Observable<SiteMembershipRequestWithPersonPaging | {}> {
        return from(this.sitesApi.getSiteMembershipRequests(opts))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    private handleError(error: any): any {
        console.error(error);
        return throwError(error || 'Server error');
    }
}
