(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var ParseResponse = (function () {
        function ParseResponse() {
        }
        ParseResponse.decorators = [
            { type: core_1.Injectable },
        ];
        ParseResponse.ctorParameters = function () { return []; };
        return ParseResponse;
    }());
    exports.ParseResponse = ParseResponse;
});
//# sourceMappingURL=parse-response.js.map