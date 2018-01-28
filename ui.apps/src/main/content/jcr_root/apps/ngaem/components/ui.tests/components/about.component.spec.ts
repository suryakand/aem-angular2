import { MockBackend } from "@angular/http/testing";
import { TestBed, tick, async, fakeAsync, inject } from "@angular/core/testing";
import { Observable } from 'rxjs/Observable';
import { ElementRef} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {AboutComponent} from "../../content/about/about.component";
import {TextAreaComponent} from "../../content/text-area/text-area.component";

import { UtilTestBed } from '../commons/testbed-init';

export class MockElementRef extends ElementRef {}

describe("Validate AboutComponent", () => {

    describe("Is Redered with H1 title as About", () => {

        beforeEach(async(() => {
            TestBed.configureTestingModule(new UtilTestBed().getTestBed([AboutComponent, TextAreaComponent], { provide: ElementRef, useClass: MockElementRef })).compileComponents();
        }));

        it('Render Component', inject([], fakeAsync(() => {
            const fixture = TestBed.createComponent(AboutComponent);
            let element = fixture.nativeElement;
            let component = fixture.componentInstance;
            fixture.detectChanges();
            tick();

            // Check that AboutComponent is rendered
            expect(element).not.toBeNull();
            expect(component).not.toBeNull();

            // Grab referece of H1 element of AboutComponent
            let titleElement = element.querySelector("h1");
            expect(titleElement).not.toBeNull();
            // Check that H1 text is "About"
            expect(titleElement.textContent).toEqual("About");
        })));
    });

});