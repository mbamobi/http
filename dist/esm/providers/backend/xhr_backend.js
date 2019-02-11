import { Injectable } from '@angular/core';
import { BrowserXhr, Headers, RequestMethod, Response, ResponseContentType, ResponseOptions, ResponseType, XSRFStrategy } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpEvents, isSuccess } from './utils';
export function getResponseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return;
}
export function xhrBackendFactory(browserXhr, responseOptions, xsrf, events) {
    return new XHRBackend(browserXhr, responseOptions, xsrf, events);
}
var XSSI_PREFIX = /^\)\]\}',?\n/;
var XHRConnection = (function () {
    function XHRConnection(req, browserXHR, baseResponseOptions, events) {
        var _this = this;
        this.events = events;
        this.request = req;
        this.response = new Observable(function (responseObserver) {
            _this.events.preRequest(req, responseObserver);
            var _xhr = browserXHR.build();
            _xhr.open(RequestMethod[req.method].toUpperCase(), req.url);
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
                var headers = Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                var url = getResponseURL(_xhr) || req.url;
                var statusText = _xhr.statusText || 'OK';
                var responseOptions = new ResponseOptions({ body: body, status: status, headers: headers, statusText: statusText, url: url });
                if (baseResponseOptions !== undefined && baseResponseOptions !== null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                var response = new Response(responseOptions);
                response.ok = isSuccess(status);
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
                var responseOptions = new ResponseOptions({
                    body: err,
                    type: ResponseType.Error,
                    status: _xhr.status,
                    statusText: _xhr.statusText,
                });
                if (baseResponseOptions !== undefined && baseResponseOptions !== null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                var response = new Response(responseOptions);
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
                req.headers = new Headers();
            }
            if (!req.headers.has('Accept')) {
                req.headers.append('Accept', 'application/json, text/plain, */*');
            }
            req.headers.forEach(function (values, name) { return _xhr.setRequestHeader(name, values.join(',')); });
            if ((req.responseType !== undefined && req.responseType !== null)
                && (_xhr.responseType !== undefined && _xhr.responseType !== null)) {
                switch (req.responseType) {
                    case ResponseContentType.ArrayBuffer:
                        _xhr.responseType = 'arraybuffer';
                        break;
                    case ResponseContentType.Json:
                        _xhr.responseType = 'json';
                        break;
                    case ResponseContentType.Text:
                        _xhr.responseType = 'text';
                        break;
                    case ResponseContentType.Blob:
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
export { XHRConnection };
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
        { type: Injectable },
    ];
    XHRBackend.ctorParameters = function () { return [
        { type: BrowserXhr, },
        { type: ResponseOptions, },
        { type: XSRFStrategy, },
        { type: HttpEvents, },
    ]; };
    return XHRBackend;
}());
export { XHRBackend };
//# sourceMappingURL=xhr_backend.js.map