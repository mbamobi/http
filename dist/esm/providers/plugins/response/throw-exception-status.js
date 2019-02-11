import { Injectable, OpaqueToken, Optional } from '@angular/core';
import { HttpException } from '../../exception';
export var ThrowExceptionStatusToken = new OpaqueToken('THROWEXCEPTIONSTATUS');
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
            throw new HttpException(message, response.status, response);
        }
        if (response.status === 0) {
            throw new HttpException('Unknown', response.status, response);
        }
    };
    ThrowExceptionStatus.prototype.extractMessage = function (response) {
        return response.statusText;
    };
    ThrowExceptionStatus.decorators = [
        { type: Injectable },
    ];
    ThrowExceptionStatus.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional },] },
    ]; };
    return ThrowExceptionStatus;
}());
export { ThrowExceptionStatus };
//# sourceMappingURL=throw-exception-status.js.map