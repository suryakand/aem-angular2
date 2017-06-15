System.register(["@angular/router", "../task-list/task-list.component", "../about/about.component"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, task_list_component_1, about_component_1, appRoutes, appRoutingProviders, routing;
    return {
        setters: [
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (task_list_component_1_1) {
                task_list_component_1 = task_list_component_1_1;
            },
            function (about_component_1_1) {
                about_component_1 = about_component_1_1;
            }
        ],
        execute: function () {
            appRoutes = [
                { path: '', redirectTo: 'tasks', pathMatch: 'full' },
                { path: 'tasks', component: task_list_component_1.TaskListComponent, data: { title: 'TaskList' } },
                { path: 'about', component: about_component_1.AboutComponent, data: { title: 'About' } }
            ];
            exports_1("appRoutingProviders", appRoutingProviders = []);
            exports_1("routing", routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true }));
        }
    };
});

//# sourceMappingURL=app.routing.js.map
