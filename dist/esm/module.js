import { NgModule } from '@angular/core';
import { BrowserXhr, ConnectionBackend, ResponseOptions, XSRFStrategy } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { CancelRequestPlugin, DefaultOptionsToken, Events, Http, HttpCordovaPlugin, HttpEvents, HttpPluginBackend, httpPluginBackendFactory, HttpPluginsToken, ParseResponsePlugin, ParseResponseToken, Plugins, RequestDefaultOptionsToken, ThrowExceptionStatus, ThrowExceptionStatusToken, xhrBackendFactory } from './providers';
var HttpModule = (function () {
    function HttpModule() {
    }
    HttpModule.initialize = function (plugins, defaultRequest, defaultResponse) {
        return {
            ngModule: HttpModule,
            providers: [
                Events,
                HttpEvents,
                {
                    provide: ConnectionBackend,
                    useFactory: xhrBackendFactory,
                    deps: [BrowserXhr, ResponseOptions, XSRFStrategy, HttpEvents]
                },
                { provide: ThrowExceptionStatusToken, useValue: null },
                { provide: ParseResponseToken, useClass: ThrowExceptionStatus, deps: [ThrowExceptionStatusToken], multi: true },
                { provide: Plugins, useClass: Plugins, deps: [HttpEvents, HttpPluginsToken] },
                { provide: RequestDefaultOptionsToken, useValue: defaultRequest },
                { provide: DefaultOptionsToken, useValue: defaultResponse },
                Http,
                plugins
            ]
        };
    };
    HttpModule.decorators = [
        { type: NgModule },
    ];
    HttpModule.ctorParameters = function () { return []; };
    return HttpModule;
}());
export { HttpModule };
var HttpCordovaPluginModule = (function () {
    function HttpCordovaPluginModule() {
    }
    HttpCordovaPluginModule.initialize = function (plugins, defaultRequest, defaultResponse) {
        return {
            ngModule: HttpCordovaPluginModule,
            providers: [
                Events,
                HttpEvents,
                HTTP,
                {
                    provide: HttpPluginBackend,
                    useFactory: httpPluginBackendFactory,
                    deps: [HTTP, HttpEvents]
                },
                { provide: ThrowExceptionStatusToken, useValue: null },
                { provide: ParseResponseToken, useClass: ThrowExceptionStatus, deps: [ThrowExceptionStatusToken], multi: true },
                { provide: Plugins, useClass: Plugins, deps: [HttpEvents, HttpPluginsToken] },
                { provide: RequestDefaultOptionsToken, useValue: defaultRequest },
                { provide: DefaultOptionsToken, useValue: defaultResponse },
                HttpCordovaPlugin,
                plugins
            ]
        };
    };
    HttpCordovaPluginModule.decorators = [
        { type: NgModule },
    ];
    HttpCordovaPluginModule.ctorParameters = function () { return []; };
    return HttpCordovaPluginModule;
}());
export { HttpCordovaPluginModule };
export var DefaultPlugins = [
    {
        provide: HttpPluginsToken,
        useClass: CancelRequestPlugin,
        multi: true
    },
    {
        provide: HttpPluginsToken,
        useClass: ParseResponsePlugin,
        deps: [ParseResponseToken],
        multi: true
    }
];
//# sourceMappingURL=module.js.map