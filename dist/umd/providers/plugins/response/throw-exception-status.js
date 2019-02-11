(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../exception"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var exception_1 = require("../../exception");
    exports.ThrowExceptionStatusToken = new core_1.OpaqueToken('THROWEXCEPTIONSTATUS');
    var ThrowExceptionStatus = (function () {
        function ThrowExceptionStatus(fnExtractMessage) {
            this.fnExtractMessage = fnExtractMessage;
        }
        ThrowExceptionStatus.prototype.parse = function (response) {
            this.throw(response);
        };
        ThrowExceptionStatus.prototype.throw = function (response) {
            if (response.status >= 400) {
                var message = typeof this.fnExtractMessage === 'function'
                    ? this.fnExtractMessage.apply(this, [response])
                    : this.extractMessage(response);
                throw new exception_1.HttpException(message, response.status, response);
            }
            if (response.status === 0) {
                throw new exception_1.HttpException('Unknown', response.status, response);
            }
        };
        ThrowExceptionStatus.prototype.extractMessage = function (response) {
            return response.statusText;
        };
        ThrowExceptionStatus.decorators = [
            { type: core_1.Injectable },
        ];
        ThrowExceptionStatus.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core_1.Optional },] },
        ]; };
        return ThrowExceptionStatus;
    }());
    exports.ThrowExceptionStatus = ThrowExceptionStatus;
});
//# sourceMappingURL=throw-exception-status.js.map