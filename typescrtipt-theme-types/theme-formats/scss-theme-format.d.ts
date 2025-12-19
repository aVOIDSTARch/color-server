/**
 * SCSS theme export format type definition.
 * @module scss-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * SCSS theme export format.
 * Generates SCSS variables and mixins for Sass-based projects.
 */
export interface ScssThemeFormat extends ExportThemeFormat<string> {
    format: "scss";
    fileExtension: ".scss";
    mimeType: "text/x-scss";
}

/**
 * Implementation configuration for SCSS theme generation.
 */
export interface ScssThemeImplementation extends ThemeImplementation {
    format: "scss";
    /** Whether to generate as a SCSS map */
    useMap: boolean;
    /** Name of the SCSS map if useMap is true */
    mapName: string;
    /** Whether to generate helper mixins */
    generateMixins: boolean;
    /** Whether to generate helper functions */
    generateFunctions: boolean;
    /** Whether to use !default flag for variables */
    useDefault: boolean;
    /** Whether to generate a _variables partial */
    generatePartial: boolean;
}
