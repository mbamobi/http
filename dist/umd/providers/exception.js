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
    var HttpException = (function () {
        function HttpException(message, code, response) {
            this._message = message;
            this._code = code;
            this._response = response;
        }
        Object.defineProperty(HttpException.prototype, "message", {
            get: function () {
                return this._message;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpException.prototype, "code", {
            get: function () {
                return this._code;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpException.prototype, "response", {
            get: function () {
                return this._response;
            },
            enumerable: true,
            configurable: true
        });
        return HttpException;
    }());
    exports.HttpException = HttpException;
    var TimeoutException = (function () {
        function TimeoutException() {
        }
        return TimeoutException;
    }());
    exports.TimeoutException = TimeoutException;
});
//# sourceMappingURL=exception.js.map