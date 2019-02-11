(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/http", "@ionic-native/http", "rxjs/Observable", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var http_1 = require("@angular/http");
    var http_2 = require("@ionic-native/http");
    var Observable_1 = require("rxjs/Observable");
    var utils_1 = require("./utils");
    function httpPluginBackendFactory(http, events) {
        return new HttpPluginBackend(http, events);
    }
    exports.httpPluginBackendFactory = httpPluginBackendFactory;
    var HttpPluginConnection = (function () {
        function HttpPluginConnection(req, pluginHttp, events) {
            var _this = this;
            this.events = events;
            this.request = req;
            this.response = new Observable_1.Observable(function (responseObserver) {
                var method = http_1.RequestMethod[req.method].toUpperCase();
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
                    var responseOptions = new http_1.ResponseOptions({
                        status: status,
                        body: data.data,
                        headers: new http_1.Headers(data.headers),
                        url: req.url,
                        statusText: ''
                    });
                    var response = new http_1.Response(responseOptions);
                    response.ok = utils_1.isSuccess(status);
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
                    var responseOptions = new http_1.ResponseOptions({
                        status: status,
                        body: error.data,
                        type: http_1.ResponseType.Error,
                        statusText: error.error
                    });
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
    exports.HttpPluginConnection = HttpPluginConnection;
    var HttpPluginBackend = (function () {
        function HttpPluginBackend(pluginHttp, events) {
            this.pluginHttp = pluginHttp;
            this.events = events;
        }
        HttpPluginBackend.prototype.createConnection = function (request) {
            return new HttpPluginConnection(request, this.pluginHttp, this.events);
        };
        HttpPluginBackend.decorators = [
            { type: core_1.Injectable },
        ];
        HttpPluginBackend.ctorParameters = function () { return [
            { type: http_2.HTTP, },
            { type: utils_1.HttpEvents, },
        ]; };
        return HttpPluginBackend;
    }());
    exports.HttpPluginBackend = HttpPluginBackend;
});
//# sourceMappingURL=http_plugin_backend.js.map