/**
 * Vue theme export format type definition.
 * @module vue-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";

/**
 * Vue theme export format.
 * Generates theme configuration for Vue.js applications.
 */
export interface VueThemeFormat extends ExportThemeFormat<string> {
    format: "vue";
    fileExtension: ".ts" | ".js" | ".vue";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for Vue theme generation.
 */
export interface VueThemeImplementation {
    format: "vue";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to use Composition API or Options API */
    compositionApi: boolean;
    /** Whether to generate a provide/inject plugin */
    generatePlugin: boolean;
    /** Whether to generate a useTheme composable */
    generateComposable: boolean;
    /** Whether to export as a Vue Single File Component */
    generateSfc: boolean;
    /** Vue version target */
    vueVersion: "2" | "3";
}
