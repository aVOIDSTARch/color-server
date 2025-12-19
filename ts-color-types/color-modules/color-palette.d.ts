/**
 * Color palette type definitions.
 * Defines palette structure containing metadata and a color collection.
 * @module color-palette
 */

import type { COLOR_FAMILY } from "../color-enums";

/**
 * Reference to a color file within a collection.
 */
export interface ColorFileReference {
    /** Relative path to the color file */
    "file-path": string;
    /** Color family category */
    "color-family": COLOR_FAMILY;
    /** Dynamic color name key mapping to filename */
    [key: string]: string;
}

/**
 * A collection of color files with metadata.
 */
export interface PaletteCollection {
    /** Name identifier for this collection */
    "file-name": string;
    /** Reference to the schema file used for individual color files */
    "schema-file": string;
    /** Brief description of the color collection */
    description: string;
    /** Array of color file references */
    "color-files": ColorFileReference[];
}

/**
 * Complete color palette with metadata and collection.
 * Matches the color-palette-schema.json structure.
 */
export interface ColorPalette {
    /** Name of the palette */
    "palette-name": string;
    /** Name of the associated project */
    "project-name"?: string;
    /** Version of the palette */
    version: string;
    /** Author of the palette */
    author: string;
    /** URL the project is associated with */
    "project-url"?: string;
    /** Description of the palette and its purpose */
    description?: string;
    /** Date the palette was created (ISO date format) */
    "date-created": string;
    /** The color collection contained in this palette */
    collection: PaletteCollection;
}

/**
 * Options for creating a new palette.
 */
export interface CreatePaletteOptions {
    /** Name of the palette */
    paletteName: string;
    /** Version string */
    version: string;
    /** Author name */
    author: string;
    /** Optional project name */
    projectName?: string;
    /** Optional project URL */
    projectUrl?: string;
    /** Optional description */
    description?: string;
    /** Collection file name */
    collectionFileName: string;
    /** Collection description */
    collectionDescription: string;
    /** Schema file path */
    schemaFile?: string;
}
