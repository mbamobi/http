export declare abstract class PluginBase {
    protected optionsInitials: {
        [key: string]: any;
    };
    protected throwsException: boolean | Function;
    constructor();
    setThrowsException(throws: boolean): this;
    getThrowsException(): boolean | Function;
    protected getOptionsInitial(): {
        [key: string]: any;
    };
    restoreOptions(): void;
    setOptions(options: Object): this;
    protected getOptionsMethodsBlackList(): Array<string>;
    protected normalizeMethodName(option: string): string;
}
