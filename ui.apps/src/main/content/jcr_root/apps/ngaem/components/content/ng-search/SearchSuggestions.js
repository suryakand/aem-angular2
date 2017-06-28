System.register(["rxjs/Subject"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var Subject_1, CustomData;
    return {
        setters: [
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }
        ],
        execute: function () {
            CustomData = (function (_super) {
                __extends(CustomData, _super);
                function CustomData(http) {
                    var _this = _super.call(this) || this;
                    _this.http = http;
                    return _this;
                }
                CustomData.prototype.search = function (term) {
                    var _this = this;
                    this.http.get("/bin/search/suggestions?q=" + term)
                        .map(function (res) {
                        // Convert the result to CompleterItem[]
                        var data = res.json();
                        var matches;
                        if (data && data['mySuggester']) {
                            matches = data['mySuggester'].map(function (episode) { return _this.convertToItem(episode); });
                            _this.next(matches);
                        }
                    }).subscribe();
                };
                CustomData.prototype.cancel = function () {
                    // Handle cancel
                };
                CustomData.prototype.convertToItem = function (data) {
                    if (!data) {
                        return null;
                    }
                    // data will be string if an initial value is set
                    return {
                        title: typeof data === "string" ? data : data.nm
                    };
                };
                return CustomData;
            }(Subject_1.Subject));
            exports_1("CustomData", CustomData);
        }
    };
});

//# sourceMappingURL=SearchSuggestions.js.map
