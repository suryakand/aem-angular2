import { FormsModule } from '@angular/forms';
import { MockBackend } from "@angular/http/testing";
import { Http, ConnectionBackend, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from "@angular/http";

export class UtilTestBed {
    private climports:any = [];
    private cldeclarations:any = [];
    private clproviders:any = [];

    constructor() {
        this.climports = [FormsModule];
        this.clproviders = [
            MockBackend,
            BaseRequestOptions,
            { provide: Http, useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                }, deps: [MockBackend, BaseRequestOptions]
            }
        ];
    }

    public getTestBed(declarations?:any, providers?:any) {
        let ci = this;
        if (providers) {
            ci.clproviders.push(providers);
        }

        if (declarations) {
            ci.cldeclarations.push(declarations);
        }

        return {
            imports: ci.climports,
            declarations: ci.cldeclarations,
            providers: ci.clproviders
        };
    }
}