/**
 * Solid theme export format type definition.
 * @module solid-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Solid theme export format.
 * Generates theme configuration for SolidJS applications.
 */
export interface SolidThemeFormat extends ExportThemeFormat<string> {
    format: "solid";
    fileExtension: ".ts" | ".tsx" | ".js" | ".jsx";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for Solid theme generation.
 */
export interface SolidThemeImplementation extends ThemeImplementation {
    format: "solid";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to include JSX extension */
    useJsx: boolean;
    /** Whether to use Solid signals for reactivity */
    useSignals: boolean;
    /** Whether to generate a context provider */
    generateProvider: boolean;
    /** Whether to generate a useTheme primitive */
    generatePrimitive: boolean;
    /** Whether to use createStore for nested theme objects */
    useStore: boolean;
}
