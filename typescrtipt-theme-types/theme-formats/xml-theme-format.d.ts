/**
 * XML theme export format type definition.
 * @module xml-theme-format
 */

import type { ExportThemeFormat } from "../export-theme-format";
import type { ThemeImplementation } from "../theme-implementation";

/**
 * XML theme export format.
 * Generates XML data for portable theme configuration.
 */
export interface XmlThemeFormat extends ExportThemeFormat<string> {
    format: "xml";
    fileExtension: ".xml";
    mimeType: "application/xml";
}

/**
 * Implementation configuration for XML theme generation.
 */
export interface XmlThemeImplementation extends ThemeImplementation {
    format: "xml";
    /** Whether to pretty print the XML output */
    prettyPrint: boolean;
    /** Indentation spaces for pretty printing */
    indentSize: 2 | 4;
    /** Whether to include XML declaration */
    includeDeclaration: boolean;
    /** XML encoding attribute */
    encoding: "UTF-8" | "UTF-16" | "ISO-8859-1";
    /** Root element name */
    rootElement: string;
    /** Whether to use attributes or child elements for values */
    useAttributes: boolean;
    /** Whether to include XSD schema reference */
    includeSchemaRef: boolean;
}
