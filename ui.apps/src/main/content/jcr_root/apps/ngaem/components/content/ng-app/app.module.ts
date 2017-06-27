import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import {AppComponent} from "./app.component";
import {TaskListComponent} from "../task-list/task-list.component";
import {AboutComponent} from "../about/about.component";
import {TaskComponent} from "../task/task.component";
import {TextAreaComponent} from "../text-area/text-area.component";
import {SearchComponent} from "../ng-search/search.component";


import {routing, appRoutingProviders} from './app.routing';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        TaskComponent,
        TaskListComponent,
        AboutComponent,
        TextAreaComponent,
        SearchComponent
    ],
    entryComponents: [AppComponent, TextAreaComponent, SearchComponent],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    ngDoBootstrap() {}
}