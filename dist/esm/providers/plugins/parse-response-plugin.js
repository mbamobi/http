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
import { Injectable, OpaqueToken } from '@angular/core';
import { PluginBase } from './plugin-base';
export var ParseResponseToken = new OpaqueToken('PARSE_RESPONSE');
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
        { type: Injectable },
    ];
    ParseResponsePlugin.ctorParameters = function () { return [
        { type: Array, },
    ]; };
    return ParseResponsePlugin;
}(PluginBase));
export { ParseResponsePlugin };
//# sourceMappingURL=parse-response-plugin.js.map