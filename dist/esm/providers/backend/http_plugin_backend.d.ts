import { Connection, ConnectionBackend, ReadyState, Request, Response } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import { HttpEvents } from './utils';
export declare function httpPluginBackendFactory(http: HTTP, events: HttpEvents): HttpPluginBackend;
export declare class HttpPluginConnection implements Connection {
    private events?;
    readyState: ReadyState;
    response: Observable<Response>;
    request: Request;
    constructor(req: Request, pluginHttp: HTTP, events?: HttpEvents);
    transformParemeters(): {
        [key: string]: any;
    };
}
export declare class HttpPluginBackend implements ConnectionBackend {
    private pluginHttp;
    private events;
    private redirectDisabled;
    constructor(pluginHttp: HTTP, events: HttpEvents);
    createConnection(request: Request): HttpPluginConnection;
}
