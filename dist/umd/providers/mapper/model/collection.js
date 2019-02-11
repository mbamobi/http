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
    var ModelCollection = (function () {
        function ModelCollection(model, path) {
            this.model = model;
            this.path = path;
            if (typeof this.model !== 'object' && this.model === null) {
                throw new Error('Data type model invalid');
            }
        }
        ModelCollection.prototype.transform = function (data) {
            var result = data.json();
            if (this.path) {
                result = jsonpath_1.default.query(result, this.path);
            }
            if (!Array.isArray(result)) {
                throw new Error("Returns should be Array");
            }
            var models = [];
            for (var i = 0, length_1 = result.length; i < length_1; i++) {
                models.push(new this.model(result[i]));
            }
            return models;
        };
        return ModelCollection;
    }());
    exports.ModelCollection = ModelCollection;
});
//# sourceMappingURL=collection.js.map