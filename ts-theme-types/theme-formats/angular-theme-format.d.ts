/**
 * Angular theme export format type definition.
 * @module angular-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";

/**
 * Angular theme export format.
 * Generates theme configuration for Angular applications.
 */
export interface AngularThemeFormat extends ExportThemeFormat<string> {
    format: "angular";
    fileExtension: ".ts" | ".scss";
    mimeType: "text/typescript" | "text/x-scss";
}

/**
 * Implementation configuration for Angular theme generation.
 */
export interface AngularThemeImplementation {
    format: "angular";
    /** Whether to generate as an injectable service */
    generateService: boolean;
    /** Whether to generate SCSS variables alongside TypeScript */
    generateScss: boolean;
    /** Whether to use Angular Material theming */
    useMaterialTheming: boolean;
    /** Whether to generate a theme module */
    generateModule: boolean;
    /** Whether to include theme switching functionality */
    includeThemeSwitcher: boolean;
    /** Angular version target */
    angularVersion: "15" | "16" | "17" | "18";
}
