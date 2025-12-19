/**
 * DaisyUI theme export format type definition.
 * @module daisyui-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * DaisyUI theme export format.
 * Generates theme configuration for DaisyUI (Tailwind CSS component library).
 */
export interface DaisyuiThemeFormat extends ExportThemeFormat<string> {
    format: "daisyui";
    fileExtension: ".js" | ".ts";
    mimeType: "text/javascript" | "text/typescript";
}

/**
 * Implementation configuration for DaisyUI theme generation.
 */
export interface DaisyuiThemeImplementation extends ThemeImplementation {
    format: "daisyui";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to extend an existing DaisyUI theme */
    extendTheme: boolean;
    /** Base theme to extend (e.g., "light", "dark", "cupcake") */
    baseTheme: string;
    /** Whether to generate as a Tailwind plugin config */
    generatePluginConfig: boolean;
    /** Whether to include CSS custom properties */
    includeCssVariables: boolean;
    /** Whether to generate complementary dark theme */
    generateDarkVariant: boolean;
    /** Color scheme for the theme */
    colorScheme: "light" | "dark";
    /** Whether to include DaisyUI semantic color mappings (primary, secondary, accent, etc.) */
    includeSemanticColors: boolean;
    /** Whether to generate color-content variants (text colors for each semantic color) */
    generateContentColors: boolean;
}
