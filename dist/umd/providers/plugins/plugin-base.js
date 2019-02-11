(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PluginBase = (function () {
        function PluginBase() {
            var _this = this;
            this.throwsException = true;
            setTimeout(function () {
                _this.optionsInitials = _this.getOptionsInitial();
            });
        }
        PluginBase.prototype.setThrowsException = function (throws) {
            this.throwsException = throws;
            return this;
        };
        PluginBase.prototype.getThrowsException = function () {
            return this.throwsException;
        };
        PluginBase.prototype.getOptionsInitial = function () {
            var options = {};
            var keys = Object.keys(this);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                options[keys[i]] = this[keys[i]];
            }
            return options;
        };
        PluginBase.prototype.restoreOptions = function () {
            this.setOptions(this.optionsInitials);
        };
        PluginBase.prototype.setOptions = function (options) {
            for (var option in options) {
                var method = this.normalizeMethodName(option);
                var methodsBlackList = this.getOptionsMethodsBlackList();
                if (typeof this[method] === 'function' && methodsBlackList.indexOf(method) === -1) {
                    this[method].apply(this, [options[option]]);
                }
            }
            return this;
        };
        PluginBase.prototype.getOptionsMethodsBlackList = function () {
            return ['constructor', 'setOptions'];
        };
        PluginBase.prototype.normalizeMethodName = function (option) {
            return [
                'set',
                option.charAt(0).toUpperCase(),
                option.slice(1)
            ].join('');
        };
        return PluginBase;
    }());
    exports.PluginBase = PluginBase;
});
//# sourceMappingURL=plugin-base.js.map