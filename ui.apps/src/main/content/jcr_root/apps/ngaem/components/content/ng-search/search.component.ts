import {Component, Input, ElementRef} from "@angular/core";
import {OnInit} from "@angular/core";

import { Http, Response }   from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
    selector: 'search',
    templateUrl: '/apps/ngaem/components/content/ng-search/search.html'
})
export class SearchComponent implements OnInit {
    text;
    queryString:String;
    numberOfResults:Number;
    elapsedTime:Number;
    numberPages:Number;
    currentPage:Number;
    searchResults: any;

    constructor(private elementRef: ElementRef, private http: Http) {
        this.text = elementRef.nativeElement.getAttribute('text');
    }

    ngOnInit() {
        console.log("TextAreaComponent initialized");
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