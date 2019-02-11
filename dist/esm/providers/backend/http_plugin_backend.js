import { Injectable } from '@angular/core';
import { Headers, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import { HttpEvents, isSuccess } from './utils';
export function httpPluginBackendFactory(http, events) {
    return new HttpPluginBackend(http, events);
}
var HttpPluginConnection = (function () {
    function HttpPluginConnection(req, pluginHttp, events) {
        var _this = this;
        this.events = events;
        this.request = req;
        this.response = new Observable(function (responseObserver) {
            var method = RequestMethod[req.method].toUpperCase();
            _this.events.preRequest(req, responseObserver);
            var promise;
            var headers = req.headers;
            var headersSerialize = {};
            headers.forEach(function (value, index) {
                value = value.filter(function (valueFilter) {
                    return valueFilter !== undefined && valueFilter !== '' && valueFilter !== null;
                });
                if (value.length) {
                    headersSerialize[index] = value.join(',');
                }
            });
            if (!headers.has('origin')) {
                headersSerialize['Origin'] = 'null';
            }
            var parameters;
            switch (method) {
                case 'GET':
                    promise = pluginHttp.get(req.url, {}, headersSerialize);
                    break;
                case 'POST':
                    parameters = _this.transformParemeters();
                    if (headers.get('content-type') === 'application/json') {
                        pluginHttp.setDataSerializer('json');
                    }
                    else {
                        pluginHttp.setDataSerializer('urlencoded');
                    }
                    promise = pluginHttp.post(req.url, parameters, headersSerialize);
                    break;
                case 'PUT':
                    parameters = _this.transformParemeters();
                    if (headers.get('content-type') === 'application/json') {
                        pluginHttp.setDataSerializer('json');
                    }
                    else {
                        pluginHttp.setDataSerializer('urlencoded');
                    }
                    promise = pluginHttp.put(req.url, parameters, headersSerialize);
                    break;
                case 'DELETE':
                    promise = pluginHttp.delete(req.url, {}, headersSerialize);
                    break;
                default:
                    throw new Error("Method '" + method + "' not allowed");
            }
            var objectDebug = {
                url: req.url,
                headers: headersSerialize,
                parameters: parameters
            };
            console.log('Debug: ', objectDebug);
            promise.then(function (data) {
                var status = data.status;
                objectDebug.headersResponse = data.headers;
                objectDebug.body = data.data;
                objectDebug.status = status;
                console.log('Debug success: ', objectDebug);
                var responseOptions = new ResponseOptions({
                    status: status,
                    body: data.data,
                    headers: new Headers(data.headers),
                    url: req.url,
                    statusText: ''
                });
                var response = new Response(responseOptions);
                response.ok = isSuccess(status);
                if (response.ok) {
                    _this.events.postRequestSuccess(response);
                    _this.events.postRequest(response);
                    responseObserver.next(response);
                    responseObserver.complete();
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
            }).catch(function (error) {
                var status = error.status;
                objectDebug.status = status;
                objectDebug.body = error.data;
                objectDebug.statusText = error.error;
                console.log('Debug error: ', objectDebug);
                var responseOptions = new ResponseOptions({
                    status: status,
                    body: error.data,
                    type: ResponseType.Error,
                    statusText: error.error
                });
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
            });
        });
    }
    HttpPluginConnection.prototype.transformParemeters = function () {
        var paramsResult = {};
        var body = this.request.getBody();
        if (typeof body === 'object') {
            try {
                return JSON.parse(body);
            }
            catch (e) {
                return body;
            }
        }
        try {
            return JSON.parse(body);
        }
        catch (e) {
            var params = body.split('&');
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                var _a = param.split('='), key = _a[0], value = _a[1];
                paramsResult[key] = value;
            }
            return paramsResult;
        }
    };
    return HttpPluginConnection;
}());
export { HttpPluginConnection };
var HttpPluginBackend = (function () {
    function HttpPluginBackend(pluginHttp, events) {
        this.pluginHttp = pluginHttp;
        this.events = events;
    }
    HttpPluginBackend.prototype.createConnection = function (request) {
        return new HttpPluginConnection(request, this.pluginHttp, this.events);
    };
    HttpPluginBackend.decorators = [
        { type: Injectable },
    ];
    HttpPluginBackend.ctorParameters = function () { return [
        { type: HTTP, },
        { type: HttpEvents, },
    ]; };
    return HttpPluginBackend;
}());
export { HttpPluginBackend };
//# sourceMappingURL=http_plugin_backend.js.map