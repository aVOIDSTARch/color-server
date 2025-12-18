// Access to the JSON Color API through TypeScript interfaces and types

export interface Color {
    name: string;
    namingSource: string;
    nickname: string;
    colorFamily: string;
    colorFormats: {
        hex: {
            hexStyle: string;
            value:string;
        };
        rgb: {
            value: {
                r: number;
                g: number;
                b: number;
            };
        };
        hsl: {
            value: {
                h: number;
                s: number;
                l: number;
            };
        };
            cmyk: {
                value: {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                };
            };
    };
    description: string;
}

export interface colorFormatString {
    format: string;
}

export interface colorFormatCollection   {
    hex: colorFormatString;
    rgb: colorFormatString;
    hsl: colorFormatString;
    cmyk: colorFormatString;
}
export interface ColorCollection {
    colors: Color[];
}

export interface ColorAPIResponse {
    status: string;
    data: ColorCollection;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk';

export interface ColorQueryParams {
    format?: ColorFormat;
    family?: string;
    name?: string;
}

export interface ColorAPI {
    getColorByName(name: string): Promise<ColorAPIResponse>;
    getColorsByFamily(family: string): Promise<ColorAPIResponse>;
    getAllColors(): Promise<ColorAPIResponse>;
}
