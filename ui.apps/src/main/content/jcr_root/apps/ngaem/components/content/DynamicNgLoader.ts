import { Type, ApplicationRef, ComponentFactoryResolver, Component, ComponentRef, Injector, NgZone, NgModuleRef} from '@angular/core';

/**
 * Class that will load Angular2 component dynamically at runtime outside of the root component.
 * This is needed because in AEM a component (Angular2 or regular AEM) can be dropped many time and that too
 * outside of root component's scope. If a component is outside of root component's scope Angular2 will
 * ignore it and will not render and that's why we need this DynamicNg2Loader.
 */

export class DynamicNg2Loader {
    private appRef: ApplicationRef;
    private componentFactoryResolver: ComponentFactoryResolver;
    private zone:NgZone;
    private injector:Injector;

    constructor(private ngModuleRef:NgModuleRef<any>) {
        this.injector = ngModuleRef.injector;
        this.appRef = this.injector.get(ApplicationRef);
        this.zone = this.injector.get(NgZone);
        this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
        console.log(this.componentFactoryResolver);
    }

    /**
     * Render component in DOM
     */
    loadComponentAtDom<T>(component:Type<T>, dom:Element, onInit?: (Component:T) => void): ComponentRef<T> {
        let componentRef;
        this.zone.run(() => {
            try {
                let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
                componentRef = componentFactory.create(this.injector, [], dom);
                onInit && onInit(componentRef.instance);
                this.appRef.attachView(componentRef.hostView);
            } catch (e) {
                console.error("Unable to load component", component, "at", dom);
                throw e;
            }
        });
        return componentRef;
    }
}