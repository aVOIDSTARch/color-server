/**
 * Color type definitions for the Color API.
 * @module typescript-color-types
 */

// Re-export color value types
export type {
    ValuesCollection,
    HexValues,
    RgbValues,
    HslValues,
    CmykValues
} from "./color-modules/color-values";

// Re-export color naming types
export type {
    NamingSource,
    ColorName
} from "./color-modules/color-names";

// Re-export color format types
export type {
    ColorFormatString,
    ColorCodes,
    ColorFormatsCollection
} from "./color-modules/color-formats";

// Re-export main color types
export type {
    Color,
    ColorCollection
} from "./color-modules/color";
