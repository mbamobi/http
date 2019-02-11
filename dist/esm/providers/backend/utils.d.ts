export declare const isSuccess: (status: number) => boolean;
import { Request, Response } from '@angular/http';
export declare class Events {
    private channels;
    subscribe(topic: string, ...handlers: Function[]): void;
    unsubscribe(topic: string, handler?: Function): boolean;
    publish(topic: string, ...args: any[]): any[];
}
export declare class HttpEvents extends Events {
    static PRE_REQUEST: string;
    static POST_REQUEST: string;
    static POST_REQUEST_SUCCESS: string;
    static POST_REQUEST_ERROR: string;
    constructor();
    preRequest(req: Request, subscribe: any): void;
    postRequest(resp: Response): void;
    postRequestSuccess(resp: Response): void;
    postRequestError(resp: Response): void;
    onPreRequest(callback: (req?: any) => any): void;
    onPostRequest(callback: (req?: any, subscribe?: any) => any): void;
    onPostRequestSuccess(callback: (req?: any) => any): void;
    onPostRequestError(callback: (req?: any) => any): void;
}
