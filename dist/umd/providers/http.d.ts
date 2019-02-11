import { OpaqueToken } from '@angular/core';
import { ConnectionBackend, Http as HttpAngular, RequestOptions, Response } from '@angular/http';
import { Config } from '@mbamobi/configuration';
import { Request } from '@mbamobi/url-resolver';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { HttpEvents, HttpPluginBackend } from './backend';
import { Mapper } from './mapper';
import { Options } from './options';
import { Plugin, Plugins } from './plugins';
export declare const RequestDefaultOptionsToken: OpaqueToken;
export declare const DefaultOptionsToken: OpaqueToken;
export interface LastRequest {
    url: any;
    params: Object;
    requestOptions: any;
    options: Options;
}
export declare class Http {
    protected events: HttpEvents;
    protected plugins: Plugins;
    protected requestFactory: Request;
    protected options: Options;
    protected requestOptions: any;
    protected lastRequest: LastRequest;
    protected requests: {
        [key: string]: LastRequest;
    };
    protected http: HttpAngular;
    constructor(options: RequestOptions, backend: ConnectionBackend, events: HttpEvents, plugins: Plugins, config: Config, requestFactory: Request, defaultOptionsRequest: any, defaultOptions: any);
    getRequestFactory(): Request;
    canRetry(id?: string): boolean;
    getLastRequest(): LastRequest;
    retryRequest(id?: string): Observable<Response>;
    request(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    requestPromise(url: any, params?: Object, requestOptions?: any, options?: Options): Promise<Response>;
    get(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    post(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    put(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    delete(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    patch(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    head(url: any, params?: Object, requestOptions?: any, options?: Options): Observable<Response>;
    protected checkForOptions(obj: any): boolean;
    protected applyDefaultOptions(options: Options): void;
    setDefaultOptions(options: Options): this;
    setTimeout(timeout: number): this;
    setMapper(mapper: Mapper): this;
    setRetry(retry: boolean): this;
    setPluginsOptions(options: {
        [key: string]: {
            [key: string]: any;
        };
    }): this;
    getPlugins(): Plugins;
    getEvents(): HttpEvents;
    getPlugin(name: string): Plugin | null;
    setDefaultRequestOptions(options: any): this;
}
export declare class HttpCordovaPlugin extends Http {
    constructor(options: RequestOptions, backend: HttpPluginBackend, events: HttpEvents, plugins: Plugins, config: Config, requestFactory: Request, defaultOptionsRequest: any, defaultOptions: any);
}
