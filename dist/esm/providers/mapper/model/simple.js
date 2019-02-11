import jp from '@ramonornela/jsonpath';
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
            result = jp.query(result, this.path)[0];
        }
        if (typeof result !== 'object') {
            throw new Error("Returns should be object");
        }
        return new this.model(result);
    };
    return ModelSimple;
}());
export { ModelSimple };
//# sourceMappingURL=simple.js.map