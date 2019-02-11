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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/http", "@mbamobi/configuration", "@mbamobi/url-resolver", "rxjs/add/observable/defer", "rxjs/add/observable/throw", "rxjs/add/operator/map", "rxjs/add/operator/timeoutWith", "rxjs/add/operator/toPromise", "rxjs/Observable", "./backend", "./exception", "./mapper", "./plugins"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var http_1 = require("@angular/http");
    var configuration_1 = require("@mbamobi/configuration");
    var url_resolver_1 = require("@mbamobi/url-resolver");
    require("rxjs/add/observable/defer");
    require("rxjs/add/observable/throw");
    require("rxjs/add/operator/map");
    require("rxjs/add/operator/timeoutWith");
    require("rxjs/add/operator/toPromise");
    var Observable_1 = require("rxjs/Observable");
    var backend_1 = require("./backend");
    var exception_1 = require("./exception");
    var mapper_1 = require("./mapper");
    var plugins_1 = require("./plugins");
    exports.RequestDefaultOptionsToken = new core_1.OpaqueToken('REQUESTDEFAULTOPTIONSTOKEN');
    exports.DefaultOptionsToken = new core_1.OpaqueToken('DEFAULTOPTIONSTOKEN');
    var KEY_CONFIG = 'http';
    var Http = (function () {
        function Http(options, backend, events, plugins, config, requestFactory, defaultOptionsRequest, defaultOptions) {
            this.events = events;
            this.plugins = plugins;
            this.requestFactory = requestFactory;
            this.options = {};
            this.requestOptions = {};
            this.lastRequest = null;
            this.requests = {};
            this.http = new http_1.Http(backend, options);
            if (config) {
                var httpConfig = config.get(KEY_CONFIG) || {};
                if (!defaultOptionsRequest && httpConfig.defaultOptionsRequest) {
                    defaultOptionsRequest = httpConfig.defaultOptionsRequest;
                }
                if (!defaultOptions && httpConfig.defaultOptions) {
                    defaultOptions = httpConfig.defaultOptions;
                }
            }
            if (defaultOptionsRequest) {
                this.setDefaultRequestOptions(defaultOptionsRequest);
            }
            if (defaultOptions) {
                this.setDefaultOptions(defaultOptions);
            }
        }
        Http.prototype.getRequestFactory = function () {
            return this.requestFactory;
        };
        Http.prototype.canRetry = function (id) {
            if (id) {
                return this.requests[id] !== undefined;
            }
            return this.lastRequest !== null;
        };
        Http.prototype.getLastRequest = function () {
            return this.lastRequest;
        };
        Http.prototype.retryRequest = function (id) {
            if (id) {
                if (!this.requests[id]) {
                    throw new Error(id + " not exists to retry");
                }
                return this.request(this.requests[id]);
            }
            return this.request(this.lastRequest);
        };
        Http.prototype.request = function (url, params, requestOptions, options) {
            var _this = this;
            if (!(url instanceof url_resolver_1.Request) && arguments.length === 1 && typeof url === 'object') {
                var objParams = url;
                url = objParams.url;
                params = objParams.params;
                requestOptions = objParams.requestOptions;
                options = objParams.options;
            }
            if (requestOptions && this.checkForOptions(requestOptions)) {
                options = requestOptions;
                requestOptions = null;
            }
            options = options || {};
            this.applyDefaultOptions(options);
            this.lastRequest = null;
            if (options.retry) {
                this.lastRequest = {
                    url: url,
                    params: params,
                    requestOptions: requestOptions,
                    options: options
                };
                this.requests[url] = this.lastRequest;
            }
            requestOptions = requestOptions || {};
            requestOptions = Object.assign({}, this.requestOptions, requestOptions);
            requestOptions.params = params;
            if (typeof url === 'string' && this.requestFactory) {
                if (this.requestFactory.getMetadata().has(url)) {
                    delete requestOptions.params;
                    url = this.requestFactory.create(url, params, requestOptions);
                    requestOptions = null;
                }
            }
            if (options.pluginsOptions) {
                this.plugins.setOptions(options.pluginsOptions);
            }
            var responseObservable = this.http.request(url, requestOptions);
            if (options.timeout) {
                responseObservable = responseObservable
                    .timeoutWith(options.timeout, Observable_1.Observable.defer(function () {
                    var err = new exception_1.TimeoutException();
                    _this.events.publish(backend_1.HttpEvents.POST_REQUEST_ERROR, err);
                    return Observable_1.Observable.throw(err);
                }));
            }
            if (options.mapper instanceof mapper_1.Mapper) {
                responseObservable = responseObservable.map(function (resp) { return options.mapper.transform(resp); });
            }
            return responseObservable;
        };
        Http.prototype.requestPromise = function (url, params, requestOptions, options) {
            return this.request.apply(this, [url, params, requestOptions, options]).toPromise();
        };
        Http.prototype.get = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'GET';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.post = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'POST';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.put = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'PUT';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.delete = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'DELETE';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.patch = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'PATCH';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.head = function (url, params, requestOptions, options) {
            requestOptions = requestOptions || {};
            requestOptions.method = 'HEAD';
            return this.request(url, params, requestOptions, options);
        };
        Http.prototype.checkForOptions = function (obj) {
            var properties = ['mapper', 'timeout', 'retry', 'pluginsOptions'];
            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                var prop = properties_1[_i];
                if (prop in obj) {
                    return true;
                }
            }
            return false;
        };
        Http.prototype.applyDefaultOptions = function (options) {
            options.mapper = options.mapper || this.options.mapper;
            options.timeout = options.timeout || this.options.timeout;
            options.pluginsOptions = options.pluginsOptions || this.options.pluginsOptions;
            options.retry = options.retry || this.options.retry;
        };
        Http.prototype.setDefaultOptions = function (options) {
            this.options = options;
            return this;
        };
        Http.prototype.setTimeout = function (timeout) {
            this.options.timeout = timeout;
            return this;
        };
        Http.prototype.setMapper = function (mapper) {
            this.options.mapper = mapper;
            return this;
        };
        Http.prototype.setRetry = function (retry) {
            this.options.retry = retry;
            return this;
        };
        Http.prototype.setPluginsOptions = function (options) {
            this.options.pluginsOptions = options;
            return this;
        };
        Http.prototype.getPlugins = function () {
            return this.plugins;
        };
        Http.prototype.getEvents = function () {
            return this.events;
        };
        Http.prototype.getPlugin = function (name) {
            return this.getPlugins().get(name);
        };
        Http.prototype.setDefaultRequestOptions = function (options) {
            if (this.requestFactory) {
                this.requestFactory.setDefaultOptions(options);
                return this;
            }
            this.requestOptions = options;
            return this;
        };
        Http.decorators = [
            { type: core_1.Injectable },
        ];
        Http.ctorParameters = function () { return [
            { type: http_1.RequestOptions, },
            { type: http_1.ConnectionBackend, },
            { type: backend_1.HttpEvents, },
            { type: plugins_1.Plugins, },
            { type: configuration_1.Config, decorators: [{ type: core_1.Optional },] },
            { type: url_resolver_1.Request, decorators: [{ type: core_1.Optional },] },
            { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [exports.RequestDefaultOptionsToken,] },] },
            { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [exports.DefaultOptionsToken,] },] },
        ]; };
        return Http;
    }());
    exports.Http = Http;
    var HttpCordovaPlugin = (function (_super) {
        __extends(HttpCordovaPlugin, _super);
        function HttpCordovaPlugin(options, backend, events, plugins, config, requestFactory, defaultOptionsRequest, defaultOptions) {
            return _super.call(this, options, backend, events, plugins, config, requestFactory, defaultOptionsRequest, defaultOptions) || this;
        }
        HttpCordovaPlugin.decorators = [
            { type: core_1.Injectable },
        ];
        HttpCordovaPlugin.ctorParameters = function () { return [
            { type: http_1.RequestOptions, },
            { type: backend_1.HttpPluginBackend, },
            { type: backend_1.HttpEvents, },
            { type: plugins_1.Plugins, },
            { type: configuration_1.Config, decorators: [{ type: core_1.Optional },] },
            { type: url_resolver_1.Request, decorators: [{ type: core_1.Optional },] },
            { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [exports.RequestDefaultOptionsToken,] },] },
            { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [exports.DefaultOptionsToken,] },] },
        ]; };
        return HttpCordovaPlugin;
    }(Http));
    exports.HttpCordovaPlugin = HttpCordovaPlugin;
});
//# sourceMappingURL=http.js.map