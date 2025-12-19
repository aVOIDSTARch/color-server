/**
 * Color value type definitions for different color systems.
 * @module color-values
 */

/**
 * Base interface for color value collections.
 */
export interface ValuesCollection {}

/**
 * Hexadecimal color values with individual digit components.
 * Each component is a single hex character (0-9, A-F).
 */
export interface HexValues extends ValuesCollection {
    /** First hex digit of red channel */
    r1: string;
    /** Second hex digit of red channel */
    r2: string;
    /** First hex digit of green channel */
    g1: string;
    /** Second hex digit of green channel */
    g2: string;
    /** First hex digit of blue channel */
    b1: string;
    /** Second hex digit of blue channel */
    b2: string;
    /** First hex digit of alpha channel */
    a1: string;
    /** Second hex digit of alpha channel */
    a2: string;
}

/**
 * RGB color values with numeric components.
 * Each component ranges from 0 to 255.
 */
export interface RgbValues extends ValuesCollection {
    /** Red channel (0-255) */
    r: number;
    /** Green channel (0-255) */
    g: number;
    /** Blue channel (0-255) */
    b: number;
}

/**
 * HSL color values with numeric components.
 * Hue is 0-360 degrees, saturation and lightness are 0-100 percent.
 */
export interface HslValues extends ValuesCollection {
    /** Hue (0-360 degrees) */
    h: number;
    /** Saturation (0-100%) */
    s: number;
    /** Lightness (0-100%) */
    l: number;
}

/**
 * CMYK color values with numeric components.
 * Each component ranges from 0 to 100 percent.
 */
export interface CmykValues extends ValuesCollection {
    /** Cyan (0-100%) */
    c: number;
    /** Magenta (0-100%) */
    m: number;
    /** Yellow (0-100%) */
    y: number;
    /** Key/Black (0-100%) */
    k: number;
}
