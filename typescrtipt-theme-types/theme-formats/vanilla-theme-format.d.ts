/**
 * Vanilla Extract theme export format type definition.
 * @module vanilla-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Vanilla Extract theme export format.
 * Generates theme configuration for Vanilla Extract CSS.
 */
export interface VanillaThemeFormat extends ExportThemeFormat<string> {
    format: "vanilla";
    fileExtension: ".css.ts";
    mimeType: "text/typescript";
}

/**
 * Implementation configuration for Vanilla Extract theme generation.
 */
export interface VanillaThemeImplementation extends ThemeImplementation {
    format: "vanilla";
    /** Whether to generate theme contract (createThemeContract) */
    generateContract: boolean;
    /** Whether to generate theme variants */
    generateVariants: boolean;
    /** Whether to generate sprinkles configuration */
    generateSprinkles: boolean;
    /** Whether to generate a light/dark theme pair */
    generateDarkMode: boolean;
    /** Whether to export CSS variables mapping */
    exportVars: boolean;
    /** Whether to use assignVars for runtime theming */
    useAssignVars: boolean;
}
