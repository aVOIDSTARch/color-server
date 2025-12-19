/**
 * Color format type definitions for color code systems and format strings.
 * @module color-formats
 */

import type { COLOR_CODE_FORMAT_STRING, COLOR_CODE_SYSTEM_NAME } from "../color-enums";
import type { ValuesCollection } from "./color-values";

/**
 * A color format string definition linking a system name to its template.
 */
export interface ColorFormatString {
    /** The color system name (e.g., HEX6, RGB, HSL) */
    name: COLOR_CODE_SYSTEM_NAME;
    /** The format template string with placeholders */
    format: COLOR_CODE_FORMAT_STRING;
}

/**
 * Color codes combining format information with actual values.
 */
export interface ColorCodes {
    /** The format string definition */
    formatString: ColorFormatString;
    /** The color values for this format */
    values: ValuesCollection;
}

/**
 * Collection of all supported color format strings.
 */
export interface ColorFormatsCollection {
    /** Hexadecimal format */
    hex: ColorFormatString;
    /** RGB format */
    rgb: ColorFormatString;
    /** HSL format */
    hsl: ColorFormatString;
    /** CMYK format */
    cmyk: ColorFormatString;
}
