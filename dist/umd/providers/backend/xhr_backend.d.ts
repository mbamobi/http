import { BrowserXhr, Connection, ConnectionBackend, ReadyState, Request, Response, ResponseOptions, XSRFStrategy } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpEvents } from './utils';
export declare function getResponseURL(xhr: any): string;
export declare function xhrBackendFactory(browserXhr: BrowserXhr, responseOptions: ResponseOptions, xsrf: XSRFStrategy, events: HttpEvents): XHRBackend;
export declare class XHRConnection implements Connection {
    private events?;
    request: Request;
    response: Observable<Response>;
    readyState: ReadyState;
    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions, events?: HttpEvents);
    setDetectedContentType(req: any, _xhr: any): void;
}
export declare class XHRBackend implements ConnectionBackend {
    private browserXHR;
    private baseResponseOptions;
    private xsrfStrategy;
    private events;
    constructor(browserXHR: BrowserXhr, baseResponseOptions: ResponseOptions, xsrfStrategy: XSRFStrategy, events: HttpEvents);
    createConnection(request: Request): XHRConnection;
}
