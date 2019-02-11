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
    var Transform = (function () {
        function Transform() {
        }
        Transform.decorators = [
            { type: core_1.Injectable },
        ];
        Transform.ctorParameters = function () { return []; };
        return Transform;
    }());
    exports.Transform = Transform;
});
//# sourceMappingURL=transform.js.map