///<reference path="../../../../../../../../typings/index.d.ts"/>
System.register(["@angular/platform-browser-dynamic", "./ng-app/app.module", "./DynamicNgLoader", "./task-list/task-list.component", "./about/about.component", "./text-area/text-area.component", "./ng-search/search.component"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_module_1, DynamicNgLoader_1, task_list_component_1, about_component_1, text_area_component_1, search_component_1, componentList;
    return {
        setters: [
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            },
            function (DynamicNgLoader_1_1) {
                DynamicNgLoader_1 = DynamicNgLoader_1_1;
            },
            function (task_list_component_1_1) {
                task_list_component_1 = task_list_component_1_1;
            },
            function (about_component_1_1) {
                about_component_1 = about_component_1_1;
            },
            function (text_area_component_1_1) {
                text_area_component_1 = text_area_component_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../../../../../typings/index.d.ts"/>
            /**
             * Make sure that this list is updated as and when a new Angular2 component in added to NgModule's entryComponents attribute.
             */
            componentList = {
                'text-area': text_area_component_1.TextAreaComponent,
                'task-list': task_list_component_1.TaskListComponent,
                'about': about_component_1.AboutComponent,
                'task': task_list_component_1.TaskListComponent,
                'search': search_component_1.SearchComponent
            };
            /**
             * Bootstrap AppModule and use DynamicNg2Loader loader to render other components which are
             * outside of root/bootstraped component's scope
             */
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(function (ng2ModuleInjector) {
                console.log("I have a reference to the injector : ", ng2ModuleInjector);
                var ng2Loader = new DynamicNgLoader_1.DynamicNg2Loader(ng2ModuleInjector);
                Object.keys(componentList).forEach(function (selector) {
                    var container = document.getElementsByTagName(selector);
                    if (container) {
                        for (var i = 0; i < container.length; i++) {
                            var element = container.item(i);
                            var compRef = ng2Loader.loadComponentAtDom(componentList[selector], element, function (instance) {
                                console.log('Text Area Component Loaded');
                            });
                        }
                    }
                });
            });
        }
    };
});

//# sourceMappingURL=main.js.map
