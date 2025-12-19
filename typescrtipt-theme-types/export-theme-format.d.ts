/**
 * Base type definitions for theme export formats.
 * This generic interface should be extended by specific format implementations.
 * @module export-theme-format
 */

/**
 * Supported theme export format identifiers.
 */
export type ThemeExportFormatType =
    | "react"
    | "css"
    | "scss"
    | "less"
    | "vue"
    | "angular"
    | "svelte"
    | "solid"
    | "styled-components"
    | "daisyui"
    | "tailwind"
    | "emotion"
    | "vanilla"
    | "json"
    | "xml";

/**
 * Base interface for all theme export formats.
 * Extend this interface to create format-specific implementations.
 * @template T - The type of the generated output content
 */
export interface ExportThemeFormat<T = string> {
    /** The export format identifier */
    format: ThemeExportFormatType;
    /** File extension for the exported file (e.g., ".css", ".ts", ".json") */
    fileExtension: string;
    /** MIME type for the exported content */
    mimeType: string;
    /** Human-readable name for the format */
    displayName: string;
    /** Brief description of the format and its use case */
    description: string;
    /** The generated output content */
    content: T;
}
