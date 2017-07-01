import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import {AppComponent} from "./app.component";
import {TaskListComponent} from "../task-list/task-list.component";
import {AboutComponent} from "../about/about.component";
import {TaskComponent} from "../task/task.component";
import {TextAreaComponent} from "../text-area/text-area.component";
import {SearchComponent} from "../ng-search/search.component";
import {IpLocationComponent} from "../ip-location/ip-location.component";

import { Ng2CompleterModule } from "ng2-completer";

import {routing, appRoutingProviders} from './app.routing';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        Ng2CompleterModule
    ],
    declarations: [
        AppComponent,
        TaskComponent,
        TaskListComponent,
        AboutComponent,
        TextAreaComponent,
        SearchComponent,
        IpLocationComponent
    ],
    entryComponents: [AppComponent, TextAreaComponent, SearchComponent, IpLocationComponent],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    ngDoBootstrap() {}
}