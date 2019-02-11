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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./plugin-base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var plugin_base_1 = require("./plugin-base");
    exports.ParseResponseToken = new core_1.OpaqueToken('PARSE_RESPONSE');
    var ParseResponsePlugin = (function (_super) {
        __extends(ParseResponsePlugin, _super);
        function ParseResponsePlugin(parseResponses) {
            var _this = _super.call(this) || this;
            _this.parseResponses = parseResponses;
            return _this;
        }
        ParseResponsePlugin.prototype.getPriority = function () {
            return 2;
        };
        ParseResponsePlugin.prototype.getName = function () {
            return 'parse-response';
        };
        ParseResponsePlugin.prototype.postRequest = function (response) {
            for (var _i = 0, _a = this.parseResponses; _i < _a.length; _i++) {
                var parseResponse = _a[_i];
                parseResponse.parse(response);
            }
        };
        ParseResponsePlugin.decorators = [
            { type: core_1.Injectable },
        ];
        ParseResponsePlugin.ctorParameters = function () { return [
            { type: Array, },
        ]; };
        return ParseResponsePlugin;
    }(plugin_base_1.PluginBase));
    exports.ParseResponsePlugin = ParseResponsePlugin;
});
//# sourceMappingURL=parse-response-plugin.js.map