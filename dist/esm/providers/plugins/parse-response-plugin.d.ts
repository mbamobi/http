import { OpaqueToken } from '@angular/core';
import { PostRequestPlugin } from './plugin';
import { PluginBase } from './plugin-base';
import { ParseResponse } from './response/parse-response';
export declare const ParseResponseToken: OpaqueToken;
export declare class ParseResponsePlugin extends PluginBase implements PostRequestPlugin {
    private parseResponses;
    constructor(parseResponses: Array<ParseResponse>);
    getPriority(): number;
    getName(): string;
    postRequest(response: any): void;
}
