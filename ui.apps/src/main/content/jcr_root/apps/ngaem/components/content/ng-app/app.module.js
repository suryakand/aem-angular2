System.register(["@angular/core", "@angular/platform-browser", "@angular/http", "./app.component", "../task-list/task-list.component", "../about/about.component", "../task/task.component", "../text-area/text-area.component", "../ng-search/search.component", "./app.routing", "@angular/forms"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, platform_browser_1, http_1, app_component_1, task_list_component_1, about_component_1, task_component_1, text_area_component_1, search_component_1, app_routing_1, forms_1, AppModule;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (task_list_component_1_1) {
                task_list_component_1 = task_list_component_1_1;
            },
            function (about_component_1_1) {
                about_component_1 = about_component_1_1;
            },
            function (task_component_1_1) {
                task_component_1 = task_component_1_1;
            },
            function (text_area_component_1_1) {
                text_area_component_1 = text_area_component_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            },
            function (app_routing_1_1) {
                app_routing_1 = app_routing_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }
        ],
        execute: function () {
            AppModule = (function () {
                function AppModule() {
                }
                AppModule.prototype.ngDoBootstrap = function () { };
                return AppModule;
            }());
            AppModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule,
                        forms_1.FormsModule,
                        http_1.HttpModule,
                        app_routing_1.routing
                    ],
                    declarations: [
                        app_component_1.AppComponent,
                        task_component_1.TaskComponent,
                        task_list_component_1.TaskListComponent,
                        about_component_1.AboutComponent,
                        text_area_component_1.TextAreaComponent,
                        search_component_1.SearchComponent
                    ],
                    entryComponents: [app_component_1.AppComponent, text_area_component_1.TextAreaComponent, search_component_1.SearchComponent],
                    providers: [
                        app_routing_1.appRoutingProviders
                    ],
                    bootstrap: [app_component_1.AppComponent]
                })
            ], AppModule);
            exports_1("AppModule", AppModule);
        }
    };
});

//# sourceMappingURL=app.module.js.map
