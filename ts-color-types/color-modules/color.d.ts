/**
 * Main color type definitions for Color and ColorCollection.
 * @module color
 */

import type { COLOR_FAMILY } from "../color-enums";
import type { ColorName } from "./color-names";
import type { ColorCodes } from "./color-formats";

/**
 * A complete color definition with all associated data.
 */
export interface Color {
    /** Unique identifier generated from the hex code */
    "unique-color-id": string;
    /** Primary color name */
    name: ColorName;
    /** Alternative names from various sources */
    "color-names": ColorName[];
    /** Informal or colloquial name */
    nickname: ColorName;
    /** Color family classification */
    "color-family": COLOR_FAMILY;
    /** Color values in different formats */
    "color-codes": ColorCodes[];
    /** Human-readable description of the color */
    description: string;
}

/**
 * A collection of colors.
 */
export interface ColorCollection {
    /** Array of color definitions */
    colors: Color[];
}
