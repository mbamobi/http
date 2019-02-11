import { OpaqueToken } from '@angular/core';
import { HttpEvents } from '../backend/utils';
import { Plugin } from './plugin';
export declare const HttpPluginsToken: OpaqueToken;
export declare class Plugins {
    protected events: HttpEvents;
    private plugins;
    private options;
    constructor(events: HttpEvents, plugins: Array<Plugin>);
    protected callEvent(method: string): void;
    set(plugins: Array<Plugin>): this;
    add(plugin: Plugin, priority?: number): this;
    get(name: string): Plugin | null;
    has(name: string): boolean;
    indexOf(name: string): number;
    remove(name: string): boolean;
    getAll(): Array<{
        [name: string]: Plugin;
    }>;
    forEach(fn: (plugin: Plugin, index?: number) => boolean | void): void;
    cleanOptions(event: string): void;
    setOptions(options: Object): this;
    runEvent(event: string, params: Array<any>): void;
}
