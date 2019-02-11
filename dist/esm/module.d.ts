import { ModuleWithProviders } from '@angular/core';
export declare class HttpModule {
    static initialize(plugins: Array<TypePlugins>, defaultRequest?: any, defaultResponse?: any): ModuleWithProviders;
}
export declare class HttpCordovaPluginModule {
    static initialize(plugins: Array<TypePlugins>, defaultRequest?: any, defaultResponse?: any): ModuleWithProviders;
}
export interface TypePlugins {
    provide: any;
    useClass: any;
    multi: boolean;
    deps?: Array<any>;
}
export declare const DefaultPlugins: any;
