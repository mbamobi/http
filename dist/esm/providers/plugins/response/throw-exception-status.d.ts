import { OpaqueToken } from '@angular/core';
import { Response } from '@angular/http';
import { ParseResponse } from './parse-response';
export declare const ThrowExceptionStatusToken: OpaqueToken;
export declare class ThrowExceptionStatus implements ParseResponse {
    private fnExtractMessage?;
    constructor(fnExtractMessage?: any);
    parse(response: Response): void;
    protected throw(response: Response): void;
    protected extractMessage(response: Response): string;
}
