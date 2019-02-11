export declare class HttpException {
    private _message;
    private _code;
    private _response;
    constructor(message: string, code: number, response: any);
    readonly message: string;
    readonly code: number;
    readonly response: any;
}
export declare class TimeoutException {
}
