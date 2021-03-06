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

import { element, by, ElementFinder } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';

export class BreadcrumbPage {

    breadcrumb: ElementFinder = element(by.css(`adf-breadcrumb nav[data-automation-id='breadcrumb']`));
    currentItem: ElementFinder = element(by.css('.adf-breadcrumb-item-current'));

    async chooseBreadCrumb(breadCrumbItem): Promise<void> {
        const path = this.breadcrumb.element(by.css(`a[data-automation-id='breadcrumb_${breadCrumbItem}']`));
        await BrowserActions.click(path);
    }

    async getActiveBreadCrumbItemName(): Promise<string> {
        return this.currentItem.getText();
    }

}
