/**
 * Emotion theme export format type definition.
 * @module emotion-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * Emotion theme export format.
 * Generates theme objects for Emotion CSS-in-JS library.
 */
export interface EmotionThemeFormat extends ExportThemeFormat<string> {
    format: "emotion";
    fileExtension: ".ts" | ".js";
    mimeType: "text/typescript" | "text/javascript";
}

/**
 * Implementation configuration for Emotion theme generation.
 */
export interface EmotionThemeImplementation extends ThemeImplementation {
    format: "emotion";
    /** Whether to generate TypeScript or JavaScript */
    useTypeScript: boolean;
    /** Whether to generate a ThemeProvider wrapper */
    generateProvider: boolean;
    /** Whether to generate augmented Theme type declaration */
    generateThemeDeclaration: boolean;
    /** Whether to generate a useTheme hook wrapper */
    generateHook: boolean;
    /** Whether to generate a Global component for reset/base styles */
    generateGlobalStyles: boolean;
    /** Whether to use @emotion/react or @emotion/styled */
    emotionPackage: "react" | "styled" | "both";
}
