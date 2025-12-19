/**
 * CSS theme export format type definition.
 * @module css-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * CSS theme export format.
 * Generates CSS custom properties (variables) for standard CSS usage.
 */
export interface CssThemeFormat extends ExportThemeFormat<string> {
    format: "css";
    fileExtension: ".css";
    mimeType: "text/css";
}

/**
 * Implementation configuration for CSS theme generation.
 */
export interface CssThemeImplementation extends ThemeImplementation {
    format: "css";
    /** Root selector for CSS variables (e.g., ":root", "body", ".theme") */
    rootSelector: string;
    /** Whether to include fallback values */
    includeFallbacks: boolean;
    /** Whether to generate dark mode variant */
    generateDarkMode: boolean;
    /** Dark mode selector (e.g., "[data-theme='dark']", ".dark-mode") */
    darkModeSelector: string;
}
