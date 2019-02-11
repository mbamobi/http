(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/http", "@ionic-native/http", "./providers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var http_1 = require("@angular/http");
    var http_2 = require("@ionic-native/http");
    var providers_1 = require("./providers");
    var HttpModule = (function () {
        function HttpModule() {
        }
        HttpModule.initialize = function (plugins, defaultRequest, defaultResponse) {
            return {
                ngModule: HttpModule,
                providers: [
                    providers_1.Events,
                    providers_1.HttpEvents,
                    {
                        provide: http_1.ConnectionBackend,
                        useFactory: providers_1.xhrBackendFactory,
                        deps: [http_1.BrowserXhr, http_1.ResponseOptions, http_1.XSRFStrategy, providers_1.HttpEvents]
                    },
                    { provide: providers_1.ThrowExceptionStatusToken, useValue: null },
                    { provide: providers_1.ParseResponseToken, useClass: providers_1.ThrowExceptionStatus, deps: [providers_1.ThrowExceptionStatusToken], multi: true },
                    { provide: providers_1.Plugins, useClass: providers_1.Plugins, deps: [providers_1.HttpEvents, providers_1.HttpPluginsToken] },
                    { provide: providers_1.RequestDefaultOptionsToken, useValue: defaultRequest },
                    { provide: providers_1.DefaultOptionsToken, useValue: defaultResponse },
                    providers_1.Http,
                    plugins
                ]
            };
        };
        HttpModule.decorators = [
            { type: core_1.NgModule },
        ];
        HttpModule.ctorParameters = function () { return []; };
        return HttpModule;
    }());
    exports.HttpModule = HttpModule;
    var HttpCordovaPluginModule = (function () {
        function HttpCordovaPluginModule() {
        }
        HttpCordovaPluginModule.initialize = function (plugins, defaultRequest, defaultResponse) {
            return {
                ngModule: HttpCordovaPluginModule,
                providers: [
                    providers_1.Events,
                    providers_1.HttpEvents,
                    http_2.HTTP,
                    {
                        provide: providers_1.HttpPluginBackend,
                        useFactory: providers_1.httpPluginBackendFactory,
                        deps: [http_2.HTTP, providers_1.HttpEvents]
                    },
                    { provide: providers_1.ThrowExceptionStatusToken, useValue: null },
                    { provide: providers_1.ParseResponseToken, useClass: providers_1.ThrowExceptionStatus, deps: [providers_1.ThrowExceptionStatusToken], multi: true },
                    { provide: providers_1.Plugins, useClass: providers_1.Plugins, deps: [providers_1.HttpEvents, providers_1.HttpPluginsToken] },
                    { provide: providers_1.RequestDefaultOptionsToken, useValue: defaultRequest },
                    { provide: providers_1.DefaultOptionsToken, useValue: defaultResponse },
                    providers_1.HttpCordovaPlugin,
                    plugins
                ]
            };
        };
        HttpCordovaPluginModule.decorators = [
            { type: core_1.NgModule },
        ];
        HttpCordovaPluginModule.ctorParameters = function () { return []; };
        return HttpCordovaPluginModule;
    }());
    exports.HttpCordovaPluginModule = HttpCordovaPluginModule;
    exports.DefaultPlugins = [
        {
            provide: providers_1.HttpPluginsToken,
            useClass: providers_1.CancelRequestPlugin,
            multi: true
        },
        {
            provide: providers_1.HttpPluginsToken,
            useClass: providers_1.ParseResponsePlugin,
            deps: [providers_1.ParseResponseToken],
            multi: true
        }
    ];
});
//# sourceMappingURL=module.js.map