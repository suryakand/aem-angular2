import { MockBackend } from "@angular/http/testing";
import { Response, ResponseOptions } from '@angular/http';
import { TestBed, tick, async, fakeAsync, inject } from "@angular/core/testing";
import { Observable } from 'rxjs/Observable';
import { ElementRef} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {IpLocationComponent} from "../../content/ip-location/ip-location.component";
import {TextAreaComponent} from "../../content/text-area/text-area.component";

import { UtilTestBed } from '../commons/testbed-init';
import {LocationService} from '../../content/services/location-service';

export class MockElementRef extends ElementRef {}

let locationService;

describe("Validate Location Service", () => {
    
    describe("Fetch location details", () => {
        beforeEach(async(() => {
            locationService = {
                searchLocation: jasmine.createSpy("searchLocation").and.returnValue(Observable.of(new Response(new ResponseOptions({
                    body: {"ip": "162.119.128.141", "country_code": "US", "country_name": "United States",
                    "region_code": "CA", "region_name": "California", "city": "San Pablo", "zip_code": "94806", "time_zone": "America/Los_Angeles", "latitude": 37.9809, "longitude": -122.3332, "metro_code": 807
                },
                status: 200
            }))))
        };
        TestBed.configureTestingModule(new UtilTestBed().getTestBed([IpLocationComponent, TextAreaComponent], [{ provide: ElementRef, useClass: MockElementRef }, {provide: LocationService, useValue: locationService}])).compileComponents();
    }));
    
    it('For location 162.220.128.141', inject([LocationService, MockBackend], fakeAsync((locationService: LocationService, mockBackend: MockBackend) => {
        const fixture = TestBed.createComponent(IpLocationComponent);
        let element = fixture.nativeElement;
        let component = fixture.componentInstance;
        
        fixture.detectChanges();
        tick();
        
        // Check that AboutComponent is rendered
        expect(element).not.toBeNull();
        expect(component).not.toBeNull();
        
        // Grab referece of input filed element and enter IP address
        let ipAddress = element.querySelector("#ipAddress");
        expect(ipAddress).not.toBeNull();
        component.queryString = '162.220.128.141';

        // Grab referece of button  element and fire click event
        let searchBtn = element.querySelector("#searchBtn");
        searchBtn.click();
        
        fixture.detectChanges();

        // Validate API response (City attribute) 
        expect(component.searchResult.city).toEqual("San Pablo");

        // Validate that API response (City attribute) has been rendered on page
        let city = element.querySelectorAll(".card-text")[4];
        console.log(city.text);
        expect(city.innerHTML).toEqual("City: San Pablo");

        // Validate that "searchLocation()" function from LocationService is called only once
        fixture.whenStable().then(() => {
            expect(locationService.searchLocation).toHaveBeenCalledTimes(1);
        });
    })));
});

});