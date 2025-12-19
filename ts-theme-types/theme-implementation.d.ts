/**
 * Base theme implementation type definition.
 * Extend this interface for format-specific implementations.
 * @module theme-implementation
 */

import type { ThemeExportFormatType } from "./export-theme-format";

/**
 * Base implementation configuration for theme generation.
 * All format-specific implementations should extend this interface.
 */
export interface ThemeImplementation {
    /** The export format this implementation targets */
    format: ThemeExportFormatType;
    /** Whether to include comments in the generated output */
    includeComments: boolean;
    /** Whether to minify the output */
    minify: boolean;
    /** Prefix for generated variable/property names */
    variablePrefix: string;
    /** Name of the exported theme object/file */
    exportName: string;
}
