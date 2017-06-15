import {Component, Input, ElementRef} from "@angular/core";
import {OnInit} from "@angular/core";

@Component({
    selector: 'text-area',
    templateUrl: '/apps/ngaem/components/content/text-area/text.html'
})
export class TextAreaComponent implements OnInit {
    text;

    constructor(private elementRef: ElementRef) {
        this.text = elementRef.nativeElement.getAttribute('text');
    }

    ngOnInit() {
        console.log("TextAreaComponent initialized");
    }
}