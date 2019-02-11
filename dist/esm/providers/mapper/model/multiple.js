import { Mapper } from '../mapper';
import { ModelCollection } from './collection';
import { ModelSimple } from './simple';
export var TypeModel = {
    Simple: 'simple',
    Collection: 'collection'
};
var ModelMultiple = (function () {
    function ModelMultiple(mapper) {
        this.mapper = mapper;
        this.types = {};
        this.addType(TypeModel.Simple, ModelSimple)
            .addType(TypeModel.Collection, ModelCollection);
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
            var mapper = Mapper.create(type, model, path);
            results[key] = mapper.transform(data);
        }
        return results;
    };
    return ModelMultiple;
}());
export { ModelMultiple };
//# sourceMappingURL=multiple.js.map