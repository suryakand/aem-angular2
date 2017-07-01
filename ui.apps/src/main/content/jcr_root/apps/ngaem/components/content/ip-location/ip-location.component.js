System.register(["@angular/core", "@angular/http", "rxjs/add/operator/catch", "rxjs/add/operator/map"], function (exports_1, context_1) {
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
    var core_1, http_1, IpLocationComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {
            IpLocationComponent = (function () {
                function IpLocationComponent(elementRef, http) {
                    this.elementRef = elementRef;
                    this.http = http;
                    this.goBtnLabel = "Go";
                    this.localtionLabel = "Location Detail";
                    var ci = this;
                    ci.goBtnLabel = ci.getProperty('goBtnLabel');
                    ci.localtionLabel = ci.getProperty('localtionLabel');
                }
                IpLocationComponent.prototype.ngOnInit = function () {
                    console.log("SearchComponent initialized");
                };
                IpLocationComponent.prototype.getProperty = function (propertyName) {
                    var ci = this;
                    if (propertyName && ci.elementRef.nativeElement.getAttribute(propertyName)) {
                        return ci.elementRef.nativeElement.getAttribute(propertyName);
                    }
                    else {
                        return ci["" + propertyName];
                    }
                };
                IpLocationComponent.prototype.search = function () {
                    var ci = this;
                    return ci.http.get("http://freegeoip.net/json/" + ci.queryString).subscribe(function (result) {
                        console.log(result);
                        ci.searchResult = result.json();
                    });
                };
                return IpLocationComponent;
            }());
            IpLocationComponent = __decorate([
                core_1.Component({
                    selector: 'ip-location',
                    templateUrl: '/bin/ngtemplate?path=/apps/ngaem/components/content/ip-location/location.html'
                }),
                __metadata("design:paramtypes", [core_1.ElementRef, http_1.Http])
            ], IpLocationComponent);
            exports_1("IpLocationComponent", IpLocationComponent);
        }
    };
});

//# sourceMappingURL=ip-location.component.js.map
