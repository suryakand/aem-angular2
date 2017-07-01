///<reference path="../../../../../../../../typings/index.d.ts"/>

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './ng-app/app.module';
import { DynamicNg2Loader } from './DynamicNgLoader';
import { ComponentRef } from '@angular/core';

import {TaskListComponent} from "./task-list/task-list.component";
import {AboutComponent} from "./about/about.component";
import {TaskComponent} from "./task/task.component";
import {TextAreaComponent} from "./text-area/text-area.component";
import {SearchComponent} from "./ng-search/search.component";
import {IpLocationComponent} from "./ip-location/ip-location.component";
/**
 * Make sure that this list is updated as and when a new Angular2 component in added to NgModule's entryComponents attribute.
 */
const componentList = {
    'text-area': TextAreaComponent,
    'task-list': TaskListComponent,
    'about': AboutComponent,
    'task': TaskListComponent,
    'search': SearchComponent,
    'ip-location': IpLocationComponent
};

/**
 * Bootstrap AppModule and use DynamicNg2Loader loader to render other components which are
 * outside of root/bootstraped component's scope
 */
platformBrowserDynamic().bootstrapModule(AppModule).then(function(ng2ModuleInjector){
    console.log("I have a reference to the injector : ", ng2ModuleInjector);
    let ng2Loader = new DynamicNg2Loader(ng2ModuleInjector);

    Object.keys(componentList).forEach(function(selector) {
        let container = document.getElementsByTagName(selector);

        if (container) {
            for (let i = 0; i < container.length; i++) {
                let element = container.item(i);
                let compRef = ng2Loader.loadComponentAtDom(componentList[selector], element, (instance) => {
                    console.log('Text Area Component Loaded');
                });
            }
        }
    });

});