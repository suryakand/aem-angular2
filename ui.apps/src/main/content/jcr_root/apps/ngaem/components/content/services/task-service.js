System.register(["@angular/core", "../models/task"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, task_1, TaskService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (task_1_1) {
                task_1 = task_1_1;
            }
        ],
        execute: function () {
            TaskService = (function () {
                function TaskService() {
                    this.tasks = [
                        new task_1.Task("Task 1", false),
                        new task_1.Task("Task 2", false),
                        new task_1.Task("Task 3", false),
                        new task_1.Task("Task 4", false),
                        new task_1.Task("Task 5", false)
                    ];
                }
                TaskService.prototype.getTasks = function () {
                    return this.tasks;
                };
                TaskService.prototype.addTask = function (name) {
                    this.tasks.push(new task_1.Task(name, false));
                };
                return TaskService;
            }());
            TaskService = __decorate([
                core_1.Injectable()
            ], TaskService);
            exports_1("TaskService", TaskService);
        }
    };
});

//# sourceMappingURL=task-service.js.map
