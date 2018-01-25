import { Injectable, InjectionToken } from '@angular/core';
import { PostRequestPlugin } from './plugin';
import { PluginBase } from './plugin-base';
import { ParseResponse } from './response/parse-response';

export const ParseResponseToken = new InjectionToken('PARSE_RESPONSE');

@Injectable()
export class ParseResponsePlugin extends PluginBase implements PostRequestPlugin {

  constructor(private parseResponses: Array<ParseResponse>) {
    super();
  }

  getPriority(): number {
    return 2;
  }

  getName() {
    return 'parse-response';
  }

  postRequest(response: any) {
    for (let parseResponse of this.parseResponses) {
      parseResponse.parse(response);
    }
  }
}
