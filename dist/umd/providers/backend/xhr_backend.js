(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/http", "rxjs/Observable", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var http_1 = require("@angular/http");
    var Observable_1 = require("rxjs/Observable");
    var utils_1 = require("./utils");
    function getResponseURL(xhr) {
        if ('responseURL' in xhr) {
            return xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
            return xhr.getResponseHeader('X-Request-URL');
        }
        return;
    }
    exports.getResponseURL = getResponseURL;
    function xhrBackendFactory(browserXhr, responseOptions, xsrf, events) {
        return new XHRBackend(browserXhr, responseOptions, xsrf, events);
    }
    exports.xhrBackendFactory = xhrBackendFactory;
    var XSSI_PREFIX = /^\)\]\}',?\n/;
    var XHRConnection = (function () {
        function XHRConnection(req, browserXHR, baseResponseOptions, events) {
            var _this = this;
            this.events = events;
            this.request = req;
            this.response = new Observable_1.Observable(function (responseObserver) {
                _this.events.preRequest(req, responseObserver);
                var _xhr = browserXHR.build();
                _xhr.open(http_1.RequestMethod[req.method].toUpperCase(), req.url);
                if (req.withCredentials !== undefined && req.withCredentials !== null) {
                    _xhr.withCredentials = req.withCredentials;
                }
                var onLoad = function () {
                    var status = _xhr.status === 1223 ? 204 : _xhr.status;
                    var body = null;
                    if (status !== 204) {
                        body = (typeof _xhr.response === 'undefined') ? _xhr.responseText : _xhr.response;
                        if (typeof body === 'string') {
                            body = body.replace(XSSI_PREFIX, '');
                        }
                    }
                    if (status === 0) {
                        status = body ? 200 : 0;
                    }
                    var headers = http_1.Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                    var url = getResponseURL(_xhr) || req.url;
                    var statusText = _xhr.statusText || 'OK';
                    var responseOptions = new http_1.ResponseOptions({ body: body, status: status, headers: headers, statusText: statusText, url: url });
                    if (baseResponseOptions !== undefined && baseResponseOptions !== null) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    var response = new http_1.Response(responseOptions);
                    response.ok = utils_1.isSuccess(status);
                    if (response.ok) {
                        _this.events.postRequestSuccess(response);
                        _this.events.postRequest(response);
                        responseObserver.next(response);
                        responseObserver.complete();
                        return;
                    }
                    var exception;
                    try {
                        responseObserver.error(response);
                    }
                    catch (ex) {
                        exception = ex;
                    }
                    _this.events.postRequestError(response);
                    _this.events.postRequest(response);
                    if (exception) {
                        throw exception;
                    }
                };
                var onError = function (err) {
                    var responseOptions = new http_1.ResponseOptions({
                        body: err,
                        type: http_1.ResponseType.Error,
                        status: _xhr.status,
                        statusText: _xhr.statusText,
                    });
                    if (baseResponseOptions !== undefined && baseResponseOptions !== null) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    var response = new http_1.Response(responseOptions);
                    var exception;
                    try {
                        responseObserver.error(response);
                    }
                    catch (ex) {
                        exception = ex;
                    }
                    _this.events.postRequestError(response);
                    _this.events.postRequest(response);
                    if (exception) {
                        throw exception;
                    }
                };
                _this.setDetectedContentType(req, _xhr);
                if (req.headers == null) {
                    req.headers = new http_1.Headers();
                }
                if (!req.headers.has('Accept')) {
                    req.headers.append('Accept', 'application/json, text/plain, */*');
                }
                req.headers.forEach(function (values, name) { return _xhr.setRequestHeader(name, values.join(',')); });
                if ((req.responseType !== undefined && req.responseType !== null)
                    && (_xhr.responseType !== undefined && _xhr.responseType !== null)) {
                    switch (req.responseType) {
                        case http_1.ResponseContentType.ArrayBuffer:
                            _xhr.responseType = 'arraybuffer';
                            break;
                        case http_1.ResponseContentType.Json:
                            _xhr.responseType = 'json';
                            break;
                        case http_1.ResponseContentType.Text:
                            _xhr.responseType = 'text';
                            break;
                        case http_1.ResponseContentType.Blob:
                            _xhr.responseType = 'blob';
                            break;
                        default:
                            throw new Error('The selected responseType is not supported');
                    }
                }
                _xhr.addEventListener('load', onLoad);
                _xhr.addEventListener('error', onError);
                _xhr.send(_this.request.getBody());
                return function () {
                    _xhr.removeEventListener('load', onLoad);
                    _xhr.removeEventListener('error', onError);
                    _xhr.abort();
                };
            });
        }
        XHRConnection.prototype.setDetectedContentType = function (req, _xhr) {
            if ((req.headers !== undefined && req.headers !== null)
                && (req.headers.get('Content-Type') !== undefined && req.headers.get('Content-Type') !== null)) {
                return;
            }
            switch (req.contentType) {
                case 0:
                    break;
                case 1:
                    _xhr.setRequestHeader('content-type', 'application/json');
                    break;
                case 2:
                    _xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                    break;
                case 4:
                    _xhr.setRequestHeader('content-type', 'text/plain');
                    break;
                case 5:
                    var blob = req.blob();
                    if (blob.type) {
                        _xhr.setRequestHeader('content-type', blob.type);
                    }
                    break;
            }
        };
        return XHRConnection;
    }());
    exports.XHRConnection = XHRConnection;
    var XHRBackend = (function () {
        function XHRBackend(browserXHR, baseResponseOptions, xsrfStrategy, events) {
            this.browserXHR = browserXHR;
            this.baseResponseOptions = baseResponseOptions;
            this.xsrfStrategy = xsrfStrategy;
            this.events = events;
        }
        XHRBackend.prototype.createConnection = function (request) {
            this.xsrfStrategy.configureRequest(request);
            return new XHRConnection(request, this.browserXHR, this.baseResponseOptions, this.events);
        };
        XHRBackend.decorators = [
            { type: core_1.Injectable },
        ];
        XHRBackend.ctorParameters = function () { return [
            { type: http_1.BrowserXhr, },
            { type: http_1.ResponseOptions, },
            { type: http_1.XSRFStrategy, },
            { type: utils_1.HttpEvents, },
        ]; };
        return XHRBackend;
    }());
    exports.XHRBackend = XHRBackend;
});
//# sourceMappingURL=xhr_backend.js.map