export interface Plugin {
    getName(): string;
    getPriority(): number;
    setOptions?: (options: Object) => this;
    restoreOptions?: () => void;
}
export interface PreRequestPlugin extends Plugin {
    preRequest(req?: any, subscriber?: any): boolean | void;
}
export interface PostRequestPlugin extends Plugin {
    postRequest(resp?: any): boolean | void;
}
export interface PostRequestSuccessPlugin extends Plugin {
    postRequestSuccess(resp?: any): boolean | void;
}
export interface PostRequestErrorPlugin extends Plugin {
    postRequestError(resp?: any): boolean | void;
}
