System.register(["@angular/core", "../services/task-service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, task_service_1, TaskListComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            }
        ],
        execute: function () {
            TaskListComponent = (function () {
                function TaskListComponent(_taskService) {
                    this._taskService = _taskService;
                    this.tasks = _taskService.getTasks();
                    this.calculateTodoCount();
                }
                TaskListComponent.prototype.ngOnInit = function () {
                    console.log("Todo component initialized with " + this.tasks.length + " tasks.");
                };
                TaskListComponent.prototype.calculateTodoCount = function () {
                    this.todoCount = this.tasks.filter(function (t) { return !t.done; }).length;
                };
                TaskListComponent.prototype.select = function (task) {
                    this.selectedTask = task;
                };
                return TaskListComponent;
            }());
            TaskListComponent = __decorate([
                core_1.Component({
                    selector: 'task-list',
                    templateUrl: '/bin/ngtemplate?path=/apps/ngaem/components/content/task-list/task-list.html',
                    styleUrls: ['/bin/ngtemplate?path=/apps/ngaem/components/content/task-list/task-list.css'],
                    providers: [task_service_1.TaskService]
                }),
                __metadata("design:paramtypes", [task_service_1.TaskService])
            ], TaskListComponent);
            exports_1("TaskListComponent", TaskListComponent);
        }
    };
});

//# sourceMappingURL=task-list.component.js.map
