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
import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs';
import { PluginBase } from './plugin-base';
var CancelRequestPlugin = (function (_super) {
    __extends(CancelRequestPlugin, _super);
    function CancelRequestPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._requests = [];
        return _this;
    }
    Object.defineProperty(CancelRequestPlugin.prototype, "requests", {
        get: function () {
            return this._requests = this._requests.filter(function (request) { return request instanceof Subscriber && !request.closed; });
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
        { type: Injectable },
    ];
    CancelRequestPlugin.ctorParameters = function () { return []; };
    return CancelRequestPlugin;
}(PluginBase));
export { CancelRequestPlugin };
//# sourceMappingURL=cancel-request-plugin.js.map