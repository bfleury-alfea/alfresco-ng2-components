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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HeaderLayoutComponent } from './header.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { By } from '@angular/platform-browser';
import { LayoutModule } from '../..';
import { Component } from '@angular/core';
import { MaterialModule } from './../../../material.module';

describe('HeaderLayoutComponent', () => {
    let fixture: ComponentFixture<HeaderLayoutComponent>;
    let component: HeaderLayoutComponent;

    describe('Input parameters', () => {
        setupTestBed({
            imports: [CoreTestingModule]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(HeaderLayoutComponent);
            component = fixture.componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should create instance of HeaderLayoutComponent', () => {
            expect(fixture.componentInstance instanceof HeaderLayoutComponent).toBe(true, 'should create HeaderLayoutComponent');
        });

        it('title element should been displayed', () => {
            const titleElement = fixture.debugElement.query(By.css('.adf-app-title'));
            expect(titleElement === null).toBeFalsy();
        });

        it('should show TEST TITLE', () => {
            component.title = 'TEST TITLE';
            fixture.detectChanges();

            const titleElement = fixture.nativeElement.querySelector('.adf-app-title');
            expect(titleElement.innerText).toEqual('TEST TITLE');
        });

        it('color attribute should be present on mat-toolbar', () => {
            component.color = 'primary';
            fixture.detectChanges();

            const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
            expect(toolbar.getAttribute('ng-reflect-color') === null).toBeFalsy();
            expect(toolbar.getAttribute('ng-reflect-color')).toEqual('primary');
        });

        it('should display the img element with the expected src if a logo path is set', () => {
            component.logo = 'logo.png';
            fixture.detectChanges();

            const logo = fixture.nativeElement.querySelector('.adf-app-logo');
            const src = logo.getAttribute('src');
            expect(logo === null).toBeFalsy();
            expect(src).toEqual('logo.png');
        });

        it('test click on sidenav button', () => {
            component.showSidenavToggle = true;
            fixture.detectChanges();
            spyOn(component.clicked, 'emit');
            const button = fixture.nativeElement.querySelector('.adf-menu-icon');

            button.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(component.clicked.emit).toHaveBeenCalledWith(true);
        });

        it('if showSidenavToggle is false the button menu should not be displayed', () => {
            component.showSidenavToggle = false;
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('.adf-menu-icon');
            expect(button === null).toBeTruthy();
        });
    });

    describe('Template tranclusion', () => {

        @Component({
            selector: 'adf-test-layout-header',
            template: `<adf-layout-header title="test" color="primary"><p>Test text<p></adf-layout-header>`
        })
        class HeaderLayoutTesterComponent {}

        beforeEach(async(() => {
            TestBed.configureTestingModule({
              declarations: [HeaderLayoutTesterComponent],
              imports: [ LayoutModule, MaterialModule ]
            })
            .compileComponents();
          }));

        it('should transclude the provided nodes into the component', () => {
            const hostFixture = TestBed.createComponent(HeaderLayoutTesterComponent);
            hostFixture.detectChanges();
            const innerText = hostFixture.nativeElement.querySelector('mat-toolbar>p').innerText;
            expect(innerText).toEqual('Test text');
        });
    });
});