/**
 * Less theme export format type definition.
 * @module less-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Less theme export format.
 * Generates Less variables for Less-based projects.
 */
export interface LessThemeFormat extends ExportThemeFormat<string> {
    format: "less";
    fileExtension: ".less";
    mimeType: "text/x-less";
}

/**
 * Implementation configuration for Less theme generation.
 */
export interface LessThemeImplementation extends ThemeImplementation {
    format: "less";
    /** Whether to generate helper mixins */
    generateMixins: boolean;
    /** Whether to generate a variables partial file */
    generatePartial: boolean;
    /** Whether to use lazy evaluation */
    useLazyEvaluation: boolean;
}
