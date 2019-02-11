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
import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';
import { ConnectionBackend, Http as HttpAngular, RequestOptions } from '@angular/http';
import { Config } from '@mbamobi/configuration';
import { Request } from '@mbamobi/url-resolver';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { HttpEvents, HttpPluginBackend } from './backend';
import { TimeoutException } from './exception';
import { Mapper } from './mapper';
import { Plugins } from './plugins';
export var RequestDefaultOptionsToken = new OpaqueToken('REQUESTDEFAULTOPTIONSTOKEN');
export var DefaultOptionsToken = new OpaqueToken('DEFAULTOPTIONSTOKEN');
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
        this.http = new HttpAngular(backend, options);
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
        if (!(url instanceof Request) && arguments.length === 1 && typeof url === 'object') {
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
                .timeoutWith(options.timeout, Observable.defer(function () {
                var err = new TimeoutException();
                _this.events.publish(HttpEvents.POST_REQUEST_ERROR, err);
                return Observable.throw(err);
            }));
        }
        if (options.mapper instanceof Mapper) {
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
        { type: Injectable },
    ];
    Http.ctorParameters = function () { return [
        { type: RequestOptions, },
        { type: ConnectionBackend, },
        { type: HttpEvents, },
        { type: Plugins, },
        { type: Config, decorators: [{ type: Optional },] },
        { type: Request, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RequestDefaultOptionsToken,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DefaultOptionsToken,] },] },
    ]; };
    return Http;
}());
export { Http };
var HttpCordovaPlugin = (function (_super) {
    __extends(HttpCordovaPlugin, _super);
    function HttpCordovaPlugin(options, backend, events, plugins, config, requestFactory, defaultOptionsRequest, defaultOptions) {
        return _super.call(this, options, backend, events, plugins, config, requestFactory, defaultOptionsRequest, defaultOptions) || this;
    }
    HttpCordovaPlugin.decorators = [
        { type: Injectable },
    ];
    HttpCordovaPlugin.ctorParameters = function () { return [
        { type: RequestOptions, },
        { type: HttpPluginBackend, },
        { type: HttpEvents, },
        { type: Plugins, },
        { type: Config, decorators: [{ type: Optional },] },
        { type: Request, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RequestDefaultOptionsToken,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DefaultOptionsToken,] },] },
    ]; };
    return HttpCordovaPlugin;
}(Http));
export { HttpCordovaPlugin };
//# sourceMappingURL=http.js.map