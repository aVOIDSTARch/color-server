/**
 * Svelte theme export format type definition.
 * @module svelte-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";

/**
 * Svelte theme export format.
 * Generates theme configuration for Svelte applications.
 */
export interface SvelteThemeFormat extends ExportThemeFormat<string> {
    format: "svelte";
    fileExtension: ".ts" | ".js" | ".svelte";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for Svelte theme generation.
 */
export interface SvelteThemeImplementation {
    format: "svelte";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to use Svelte stores for reactivity */
    useStores: boolean;
    /** Whether to generate a Svelte component wrapper */
    generateComponent: boolean;
    /** Whether to generate context-based theme access */
    useContext: boolean;
    /** Whether to target SvelteKit */
    svelteKit: boolean;
    /** Svelte version target */
    svelteVersion: "3" | "4" | "5";
}
