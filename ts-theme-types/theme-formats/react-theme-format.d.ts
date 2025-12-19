/**
 * React theme export format type definition.
 * @module react-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";

/**
 * React theme export format.
 * Generates TypeScript/JavaScript theme objects for React applications.
 */
export interface ReactThemeFormat extends ExportThemeFormat<string> {
    format: "react";
    fileExtension: ".ts" | ".tsx" | ".js" | ".jsx";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for React theme generation.
 */
export interface ReactThemeImplementation {
    format: "react";
    /** Whether to generate TypeScript (.ts/.tsx) or JavaScript (.js/.jsx) */
    useTypeScript: boolean;
    /** Whether to include JSX extension */
    useJsx: boolean;
    /** Whether to export as default or named export */
    defaultExport: boolean;
    /** Whether to include TypeScript type annotations */
    includeTypes: boolean;
    /** Whether to generate a ThemeProvider wrapper component */
    generateProvider: boolean;
    /** Whether to generate a useTheme hook */
    generateHook: boolean;
    /** Context API or state management library to use */
    stateManagement: "context" | "redux" | "zustand" | "jotai" | "none";
}
