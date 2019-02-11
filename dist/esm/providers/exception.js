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
export { HttpException };
var TimeoutException = (function () {
    function TimeoutException() {
    }
    return TimeoutException;
}());
export { TimeoutException };
//# sourceMappingURL=exception.js.map