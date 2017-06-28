import {Component, Input, ElementRef} from "@angular/core";
import {OnInit} from "@angular/core";

import { Http, Response }   from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CompleterService, CompleterData } from 'ng2-completer';
import {CustomData} from './SearchSuggestions';

@Component({
    selector: 'search',
    templateUrl: '/apps/ngaem/components/content/ng-search/search.html'
})
export class SearchComponent implements OnInit {
    goBtnLabel:String = "Go";
    searchPlaceHolder:String = "Search Content";
    previousBtnLabel:String = "Previous";
    nextBtnLabel:String = "Next";
    queryString:String;
    numberOfResults:Number;
    elapsedTime:Number;
    numberPages:Number;
    currentPage:Number;
    searchResults: any;
    suggestion: any;
    dataRemote: CompleterData;

    constructor(private elementRef: ElementRef, private http: Http, public completerService: CompleterService) {
        let ci = this;
        ci.goBtnLabel = ci.getProperty('goBtnLabel');
        ci.searchPlaceHolder = ci.getProperty('searchPlaceHolder');
        ci.previousBtnLabel = ci.getProperty('previousBtnLabel');
        ci.nextBtnLabel = ci.getProperty('nextBtnLabel');
        ci.dataRemote = new CustomData(http);
    }

    ngOnInit() {
        console.log("TextAreaComponent initialized");
    }

    private getProperty(propertyName:String) {
        let ci = this;
        if (propertyName && ci.elementRef.nativeElement.getAttribute(propertyName)) {
            return ci.elementRef.nativeElement.getAttribute(propertyName);
        } else {
            return ci[`${propertyName}`];
        }
    }

    search(pageNumber:number) {
        let ci = this;
        return ci.http.get(`/bin/search?q=${ci.queryString}&path=/content&start=${pageNumber * 10}`).subscribe(result => {
            console.log(result);
            ci.searchResults = result.json();
            ci.searchResults.pages = new Array();
            for (let i = 0; i < ci.searchResults.numberPages; i++) {
                ci.searchResults.pages.push(i);
            }
        });
    }

}