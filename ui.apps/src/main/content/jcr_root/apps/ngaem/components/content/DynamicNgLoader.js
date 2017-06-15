System.register(["@angular/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, DynamicNg2Loader;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            /**
             * Class that will load Angular2 component dynamically at runtime outside of the root component.
             * This is needed because in AEM a component (Angular2 or regular AEM) can be dropped many time and that too
             * outside of root component's scope. If a component is outside of root component's scope Angular2 will
             * ignore it and will not render and that's why we need this DynamicNg2Loader.
             */
            DynamicNg2Loader = (function () {
                function DynamicNg2Loader(ngModuleRef) {
                    this.ngModuleRef = ngModuleRef;
                    this.injector = ngModuleRef.injector;
                    this.appRef = this.injector.get(core_1.ApplicationRef);
                    this.zone = this.injector.get(core_1.NgZone);
                    this.componentFactoryResolver = this.injector.get(core_1.ComponentFactoryResolver);
                    console.log(this.componentFactoryResolver);
                }
                /**
                 * Render component in DOM
                 */
                DynamicNg2Loader.prototype.loadComponentAtDom = function (component, dom, onInit) {
                    var _this = this;
                    var componentRef;
                    this.zone.run(function () {
                        try {
                            var componentFactory = _this.componentFactoryResolver.resolveComponentFactory(component);
                            componentRef = componentFactory.create(_this.injector, [], dom);
                            onInit && onInit(componentRef.instance);
                            _this.appRef.attachView(componentRef.hostView);
                        }
                        catch (e) {
                            console.error("Unable to load component", component, "at", dom);
                            throw e;
                        }
                    });
                    return componentRef;
                };
                return DynamicNg2Loader;
            }());
            exports_1("DynamicNg2Loader", DynamicNg2Loader);
        }
    };
});

//# sourceMappingURL=DynamicNgLoader.js.map
