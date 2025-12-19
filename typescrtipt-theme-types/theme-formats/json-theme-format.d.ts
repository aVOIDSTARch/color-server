/**
 * JSON theme export format type definition.
 * @module json-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * JSON theme export format.
 * Generates JSON data for portable theme configuration.
 */
export interface JsonThemeFormat extends ExportThemeFormat<string> {
    format: "json";
    fileExtension: ".json";
    mimeType: "application/json";
}

/**
 * Implementation configuration for JSON theme generation.
 */
export interface JsonThemeImplementation extends ThemeImplementation {
    format: "json";
    /** Whether to pretty print the JSON output */
    prettyPrint: boolean;
    /** Indentation spaces for pretty printing */
    indentSize: 2 | 4;
    /** Whether to include a $schema reference */
    includeSchema: boolean;
    /** Schema URL if includeSchema is true */
    schemaUrl: string;
    /** Whether to flatten nested color structures */
    flattenStructure: boolean;
    /** Whether to include metadata in output */
    includeMetadata: boolean;
}
