/**
 * Tailwind CSS theme export format type definition.
 * @module tailwind-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Tailwind CSS theme export format.
 * Generates theme configuration for Tailwind CSS.
 */
export interface TailwindThemeFormat extends ExportThemeFormat<string> {
    format: "tailwind";
    fileExtension: ".js" | ".ts";
    mimeType: "text/javascript" | "text/typescript";
}

/**
 * Implementation configuration for Tailwind theme generation.
 */
export interface TailwindThemeImplementation extends ThemeImplementation {
    format: "tailwind";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to extend or replace default Tailwind colors */
    extendColors: boolean;
    /** Whether to generate as a Tailwind plugin */
    generatePlugin: boolean;
    /** Whether to generate CSS custom properties fallback */
    generateCssVariables: boolean;
    /** Whether to include dark mode variants */
    includeDarkMode: boolean;
    /** Dark mode strategy */
    darkModeStrategy: "class" | "media" | "selector";
    /** Tailwind version target */
    tailwindVersion: "3" | "4";
}
