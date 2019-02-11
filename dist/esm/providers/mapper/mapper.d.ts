import { Transform } from './transform';
export declare class Mapper {
    private _transform;
    private constructor();
    static create(transform: any, ...args: Array<any>): Mapper;
    getTransform(): Transform;
    transform(data: any): any;
}
