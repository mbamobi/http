(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@ramonornela/jsonpath"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jsonpath_1 = require("@ramonornela/jsonpath");
    var ModelSimple = (function () {
        function ModelSimple(model, path) {
            this.model = model;
            this.path = path;
            if (typeof this.model !== 'object' && this.model === null) {
                throw new Error('Data type model invalid');
            }
        }
        ModelSimple.prototype.transform = function (data) {
            var result = data.json();
            if (this.path) {
                result = jsonpath_1.default.query(result, this.path)[0];
            }
            if (typeof result !== 'object') {
                throw new Error("Returns should be object");
            }
            return new this.model(result);
        };
        return ModelSimple;
    }());
    exports.ModelSimple = ModelSimple;
});
//# sourceMappingURL=simple.js.map