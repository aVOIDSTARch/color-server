/**
 * Styled Components theme export format type definition.
 * @module styled-components-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Styled Components theme export format.
 * Generates theme objects for styled-components library.
 */
export interface StyledComponentsThemeFormat extends ExportThemeFormat<string> {
    format: "styled-components";
    fileExtension: ".ts" | ".js";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for Styled Components theme generation.
 */
export interface StyledComponentsThemeImplementation extends ThemeImplementation {
    format: "styled-components";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to generate a ThemeProvider wrapper */
    generateProvider: boolean;
    /** Whether to generate augmented DefaultTheme type declaration */
    generateThemeDeclaration: boolean;
    /** Whether to generate a useTheme hook wrapper */
    generateHook: boolean;
    /** Whether to generate a GlobalStyle component */
    generateGlobalStyle: boolean;
    /** Whether to include CSS reset in GlobalStyle */
    includeCssReset: boolean;
}
