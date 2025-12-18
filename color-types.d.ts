// type definitions for the Color API

export interface NamingSource {
    name: string;
    url?: string;
}

export interface OtherName {
    name: string;
    source: NamingSource | string;
}

export interface HexValues {
    r1: string;
    r2: string;
    g1: string;
    g2: string;
    b1: string;
    b2: string;
    a1: string;
    a2: string;
}

export interface RgbValues {
    r: number;
    g: number;
    b: number;
}

export interface HslValues {
    h: number;
    s: number;
    l: number;
}

export interface CmykValues {
    c: number;
    m: number;
    y: number;
    k: number;
}

export interface ColorCodes {
    hex: { values: HexValues };
    rgb: { values: RgbValues };
    hsl: { values: HslValues };
    cmyk: { values: CmykValues };
}

export interface Color {
    "unique-color-id": string;
    name: string;
    "naming-source": string;
    "other-names": OtherName[];
    nickname: string;
    "color-family": string;
    "color-codes": ColorCodes;
    description: string;
}

export interface ColorFormatString {
    name: string;
    format: string;
}

export declare const hexColorFormatString: ColorFormatString;
export declare const rgbColorFormatString: ColorFormatString;
export declare const hslColorFormatString: ColorFormatString;
export declare const cmykColorFormatString: ColorFormatString;

export interface ColorFormatCollection {
    hex: ColorFormatString;
    rgb: ColorFormatString;
    hsl: ColorFormatString;
    cmyk: ColorFormatString;
}

export interface ColorCollection {
    colors: Color[];
}
