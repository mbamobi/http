(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../mapper", "./collection", "./simple"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapper_1 = require("../mapper");
    var collection_1 = require("./collection");
    var simple_1 = require("./simple");
    exports.TypeModel = {
        Simple: 'simple',
        Collection: 'collection'
    };
    var ModelMultiple = (function () {
        function ModelMultiple(mapper) {
            this.mapper = mapper;
            this.types = {};
            this.addType(exports.TypeModel.Simple, simple_1.ModelSimple)
                .addType(exports.TypeModel.Collection, collection_1.ModelCollection);
        }
        ModelMultiple.prototype.addType = function (type, model) {
            this.types[type] = model;
            return this;
        };
        ModelMultiple.prototype.transform = function (data) {
            var results = {};
            for (var key in this.mapper) {
                if (!this.types[this.mapper[key].type]) {
                    var typeException = this.mapper[key].type;
                    throw new Error("Type " + typeException + " not exits");
                }
                var model = this.mapper[key].model;
                var path = this.mapper[key].path;
                var type = this.types[this.mapper[key].type];
                var mapper = mapper_1.Mapper.create(type, model, path);
                results[key] = mapper.transform(data);
            }
            return results;
        };
        return ModelMultiple;
    }());
    exports.ModelMultiple = ModelMultiple;
});
//# sourceMappingURL=multiple.js.map