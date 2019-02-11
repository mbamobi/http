import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PreRequestPlugin } from './plugin';
import { PluginBase } from './plugin-base';
export declare class CancelRequestPlugin extends PluginBase implements PreRequestPlugin {
    private _requests;
    protected readonly requests: Observable<Response>[];
    getPriority(): number;
    getName(): string;
    preRequest(response: any, subscriber: any): void;
    cancelAll(): void;
}
