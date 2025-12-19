/**
 * Color naming type definitions for color sources and alternative names.
 * @module color-names
 */

/**
 * Source information for a color name.
 */
export interface NamingSource {
    /** Name of the source (e.g., "Pantone", "color.pizza") */
    name: string;
    /** Optional URL to the source */
    url?: string;
}

/**
 * A color name with its source attribution.
 */
export interface ColorName {
    /** The color name */
    name: string;
    /** Source of this name - either a structured object or simple string */
    source: NamingSource | string;
}
