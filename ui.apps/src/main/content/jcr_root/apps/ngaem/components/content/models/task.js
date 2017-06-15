System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Task;
    return {
        setters: [],
        execute: function () {
            Task = (function () {
                function Task(name, done) {
                    this.name = name;
                    this.done = done;
                }
                Task.prototype.toggleDone = function () {
                    this.done = !this.done;
                };
                return Task;
            }());
            exports_1("Task", Task);
        }
    };
});

//# sourceMappingURL=task.js.map
