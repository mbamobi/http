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
        define(["require", "exports", "@angular/core", "rxjs", "./plugin-base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var rxjs_1 = require("rxjs");
    var plugin_base_1 = require("./plugin-base");
    var CancelRequestPlugin = (function (_super) {
        __extends(CancelRequestPlugin, _super);
        function CancelRequestPlugin() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._requests = [];
            return _this;
        }
        Object.defineProperty(CancelRequestPlugin.prototype, "requests", {
            get: function () {
                return this._requests = this._requests.filter(function (request) { return request instanceof rxjs_1.Subscriber && !request.closed; });
            },
            enumerable: true,
            configurable: true
        });
        CancelRequestPlugin.prototype.getPriority = function () {
            return 3;
        };
        CancelRequestPlugin.prototype.getName = function () {
            return 'cancel-request';
        };
        CancelRequestPlugin.prototype.preRequest = function (response, subscriber) {
            this._requests.push(subscriber);
        };
        CancelRequestPlugin.prototype.cancelAll = function () {
            this.requests.forEach(function (request) { return request.unsubscribe(); });
        };
        CancelRequestPlugin.decorators = [
            { type: core_1.Injectable },
        ];
        CancelRequestPlugin.ctorParameters = function () { return []; };
        return CancelRequestPlugin;
    }(plugin_base_1.PluginBase));
    exports.CancelRequestPlugin = CancelRequestPlugin;
});
//# sourceMappingURL=cancel-request-plugin.js.map