// Access to the JSON Color API through TypeScript interfaces and types

import { Color, ColorCollection, ColorFormatCollection, } from './color-types';
import { COLOR_CODE_FORMAT_STRING, COLOR_CODE_SYSTEM_NAME, COLOR_FAMILIES }  from './color-enums';


export interface ColorAPIResponse {
    status: string;
    data: ColorCollection;
}

export interface ColorQueryParams {
    format?: COLOR_CODE_FORMAT_STRING
    family?: COLOR_FAMILIES;
    codeSystem?: COLOR_CODE_SYSTEM_NAME;
    name?: string;
}

export interface ColorAPI {
    getColorByName(name: string): Promise<ColorAPIResponse>;
    getColorsByFamily(family: string): Promise<ColorAPIResponse>;
    getColorsByCodeSystem(system: string): Promise<ColorAPIResponse>;
    getAllColors(): Promise<ColorAPIResponse>;
}
