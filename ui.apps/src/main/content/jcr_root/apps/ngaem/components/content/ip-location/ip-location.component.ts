import {Component, Input, ElementRef} from "@angular/core";
import {OnInit} from "@angular/core";

import { Http, Response }   from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'ip-location',
    templateUrl: '/apps/ngaem/components/content/ip-location/location.html'
})
export class IpLocationComponent implements OnInit {
    queryString:String;
    goBtnLabel:String = "Go";
    localtionLabel:String = "Location Detail";
    searchResult:any;
    constructor(private elementRef: ElementRef, private http: Http) {
        let ci = this;
        ci.goBtnLabel = ci.getProperty('goBtnLabel');
        ci.localtionLabel = ci.getProperty('localtionLabel');
    }

    ngOnInit() {
        console.log("SearchComponent initialized");
    }

    private getProperty(propertyName:String) {
        let ci = this;
        if (propertyName && ci.elementRef.nativeElement.getAttribute(propertyName)) {
            return ci.elementRef.nativeElement.getAttribute(propertyName);
        } else {
            return ci[`${propertyName}`];
        }
    }

    search() {
        let ci = this;
        return ci.http.get(`http://freegeoip.net/json/${ci.queryString}`).subscribe(result => {
            console.log(result);
            ci.searchResult = result.json();
        });
    }

}