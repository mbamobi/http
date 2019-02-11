var Mapper = (function () {
    function Mapper(transform) {
        this._transform = transform;
    }
    Mapper.create = function (transform) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var instance = Object.create(transform.prototype);
        instance.constructor.apply(instance, args);
        return new Mapper(instance);
    };
    Mapper.prototype.getTransform = function () {
        return this._transform;
    };
    Mapper.prototype.transform = function (data) {
        return this._transform.transform(data);
    };
    return Mapper;
}());
export { Mapper };
//# sourceMappingURL=mapper.js.map