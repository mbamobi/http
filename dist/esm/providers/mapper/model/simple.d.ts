import { Response } from '@angular/http';
import { Transform } from '../transform';
export declare class ModelSimple implements Transform {
    private model;
    private path?;
    constructor(model: any, path?: string);
    transform(data: Response): any;
}
