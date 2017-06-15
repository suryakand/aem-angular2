import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app",
    templateUrl: "/apps/ngaem/components/content/ng-app/app.html"
})
export class AppComponent implements OnInit {
    ngOnInit() {
        console.log("Application component initialized ...");
    }
}