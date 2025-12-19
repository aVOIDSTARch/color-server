/**
 * Color Palette Model
 * Implements the color palette schema with full CRUD operations.
 * Uses types from ts-color-types.
 */

import { JsonMaker } from "../json-maker";
import { COLOR_FAMILY } from "../ts-color-types/color-enums";
import type {
    ColorPalette,
    PaletteCollection,
    ColorFileReference,
    CreatePaletteOptions
} from "../ts-color-types/color-types-index.d";
import { ColorCollectionModel } from "./color-collection";
import { ColorModel, ColorRepository } from "./color";

// Schema path
const PALETTE_SCHEMA = "color-palette-schema.json";

/**
 * ColorPaletteModel class for working with color palette data
 */
export class ColorPaletteModel {
    private jsonMaker: JsonMaker;
    private data: ColorPalette;

    constructor(data: ColorPalette, schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.data = data;
    }

    // Getters
    get paletteName(): string {
        return this.data["palette-name"];
    }

    get projectName(): string | undefined {
        return this.data["project-name"];
    }

    get version(): string {
        return this.data.version;
    }

    get author(): string {
        return this.data.author;
    }

    get projectUrl(): string | undefined {
        return this.data["project-url"];
    }

    get description(): string | undefined {
        return this.data.description;
    }

    get dateCreated(): string {
        return this.data["date-created"];
    }

    get collection(): PaletteCollection {
        return this.data.collection;
    }

    // Setters
    set paletteName(value: string) {
        this.data["palette-name"] = value;
    }

    set projectName(value: string | undefined) {
        this.data["project-name"] = value;
    }

    set version(value: string) {
        this.data.version = value;
    }

    set author(value: string) {
        this.data.author = value;
    }

    set projectUrl(value: string | undefined) {
        this.data["project-url"] = value;
    }

    set description(value: string | undefined) {
        this.data.description = value;
    }

    // Get raw data
    toJSON(): ColorPalette {
        return { ...this.data };
    }

    // Get collection as a model
    getCollectionModel(): ColorCollectionModel {
        return new ColorCollectionModel(this.data.collection);
    }

    // Update collection
    setCollection(collection: PaletteCollection): void {
        this.data.collection = collection;
    }

    // Add a color file to the collection
    addColorFile(reference: ColorFileReference): void {
        this.data.collection["color-files"].push(reference);
    }

    // Remove a color file from the collection
    removeColorFile(filePath: string): boolean {
        const index = this.data.collection["color-files"].findIndex(
            (ref) => ref["file-path"] === filePath
        );
        if (index !== -1) {
            this.data.collection["color-files"].splice(index, 1);
            return true;
        }
        return false;
    }

    // Get all color files
    getColorFiles(): ColorFileReference[] {
        return this.data.collection["color-files"];
    }

    // Get color files by family
    getColorFilesByFamily(family: COLOR_FAMILY): ColorFileReference[] {
        return this.data.collection["color-files"].filter(
            (ref) => ref["color-family"] === family
        );
    }

    // Get total file count
    getColorFileCount(): number {
        return this.data.collection["color-files"].length;
    }

    // Get all unique color families
    getColorFamilies(): COLOR_FAMILY[] {
        const families = new Set<COLOR_FAMILY>();
        for (const ref of this.data.collection["color-files"]) {
            families.add(ref["color-family"] as COLOR_FAMILY);
        }
        return Array.from(families);
    }

    // Increment version (semantic versioning patch)
    bumpPatchVersion(): void {
        const parts = this.data.version.split(".");
        if (parts.length >= 3) {
            parts[2] = String(parseInt(parts[2], 10) + 1);
            this.data.version = parts.join(".");
        }
    }

    // Increment version (semantic versioning minor)
    bumpMinorVersion(): void {
        const parts = this.data.version.split(".");
        if (parts.length >= 2) {
            parts[1] = String(parseInt(parts[1], 10) + 1);
            if (parts.length >= 3) {
                parts[2] = "0";
            }
            this.data.version = parts.join(".");
        }
    }

    // Increment version (semantic versioning major)
    bumpMajorVersion(): void {
        const parts = this.data.version.split(".");
        if (parts.length >= 1) {
            parts[0] = String(parseInt(parts[0], 10) + 1);
            if (parts.length >= 2) {
                parts[1] = "0";
            }
            if (parts.length >= 3) {
                parts[2] = "0";
            }
            this.data.version = parts.join(".");
        }
    }

    // Validate against schema
    validate(): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validate(this.data, PALETTE_SCHEMA);
    }
}

/**
 * ColorPaletteRepository for managing color palette files
 */
export class ColorPaletteRepository {
    private jsonMaker: JsonMaker;
    private colorRepository: ColorRepository;

    constructor(schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.colorRepository = new ColorRepository(schemaDir);
    }

    // Load palette from a file
    loadFromFile(filePath: string): ColorPaletteModel {
        const validation = this.jsonMaker.validateFile(filePath, PALETTE_SCHEMA);
        if (!validation.valid) {
            throw new Error(
                `Invalid palette file: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        const data = this.jsonMaker.readData({
            type: "file",
            path: filePath
        }) as ColorPalette;
        return new ColorPaletteModel(data);
    }

    // Save palette to a file
    saveToFile(palette: ColorPaletteModel, filePath: string): void {
        const data = palette.toJSON();
        const validation = this.jsonMaker.validate(data, PALETTE_SCHEMA);

        if (!validation.valid) {
            throw new Error(
                `Invalid palette data: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        this.jsonMaker.writeJson(data, filePath);
    }

    // Create a new palette from options
    createPalette(options: CreatePaletteOptions): ColorPaletteModel {
        const today = new Date().toISOString().split("T")[0];

        const paletteData: ColorPalette = {
            "palette-name": options.paletteName,
            version: options.version,
            author: options.author,
            "date-created": today,
            collection: {
                "file-name": options.collectionFileName,
                "schema-file": options.schemaFile || "color-file-schema.json",
                description: options.collectionDescription,
                "color-files": []
            }
        };

        if (options.projectName) {
            paletteData["project-name"] = options.projectName;
        }
        if (options.projectUrl) {
            paletteData["project-url"] = options.projectUrl;
        }
        if (options.description) {
            paletteData.description = options.description;
        }

        return new ColorPaletteModel(paletteData);
    }

    // Load all colors from a palette
    loadAllColors(
        palette: ColorPaletteModel,
        baseDir: string = "./data"
    ): Map<string, ColorModel[]> {
        const colorMap = new Map<string, ColorModel[]>();

        for (const ref of palette.getColorFiles()) {
            const fullPath = `${baseDir}/${ref["file-path"]}`;
            try {
                const colors = this.colorRepository.loadFromFile(fullPath);
                colorMap.set(ref["file-path"], colors);
            } catch (error) {
                console.warn(`Failed to load colors from ${fullPath}: ${error}`);
                colorMap.set(ref["file-path"], []);
            }
        }

        return colorMap;
    }

    // Get total color count across all files in palette
    getTotalColorCount(
        palette: ColorPaletteModel,
        baseDir: string = "./data"
    ): number {
        let count = 0;
        const colors = this.loadAllColors(palette, baseDir);
        colors.forEach((colorArray) => {
            count += colorArray.length;
        });
        return count;
    }

    // Get all colors by family from palette
    getColorsByFamily(
        palette: ColorPaletteModel,
        family: COLOR_FAMILY,
        baseDir: string = "./data"
    ): ColorModel[] {
        const familyFiles = palette.getColorFilesByFamily(family);
        const allColors: ColorModel[] = [];

        for (const ref of familyFiles) {
            const fullPath = `${baseDir}/${ref["file-path"]}`;
            try {
                const colors = this.colorRepository.loadFromFile(fullPath);
                allColors.push(...colors);
            } catch (error) {
                console.warn(`Failed to load colors from ${fullPath}: ${error}`);
            }
        }

        return allColors;
    }

    // Find a specific color by ID across all files in palette
    findColorById(
        palette: ColorPaletteModel,
        colorId: string,
        baseDir: string = "./data"
    ): { color: ColorModel; filePath: string } | undefined {
        for (const ref of palette.getColorFiles()) {
            const fullPath = `${baseDir}/${ref["file-path"]}`;
            try {
                const colors = this.colorRepository.loadFromFile(fullPath);
                const found = colors.find((c) => c.id === colorId);
                if (found) {
                    return { color: found, filePath: ref["file-path"] };
                }
            } catch (error) {
                // Skip files that can't be loaded
            }
        }
        return undefined;
    }

    // Find colors by name across all files in palette
    findColorsByName(
        palette: ColorPaletteModel,
        name: string,
        baseDir: string = "./data"
    ): Array<{ color: ColorModel; filePath: string }> {
        const results: Array<{ color: ColorModel; filePath: string }> = [];
        const lowerName = name.toLowerCase();

        for (const ref of palette.getColorFiles()) {
            const fullPath = `${baseDir}/${ref["file-path"]}`;
            try {
                const colors = this.colorRepository.loadFromFile(fullPath);
                for (const color of colors) {
                    if (color.name.toLowerCase().includes(lowerName)) {
                        results.push({ color, filePath: ref["file-path"] });
                    }
                }
            } catch (error) {
                // Skip files that can't be loaded
            }
        }

        return results;
    }

    // Clone a palette with a new name
    clonePalette(
        source: ColorPaletteModel,
        newPaletteName: string,
        newAuthor?: string
    ): ColorPaletteModel {
        const today = new Date().toISOString().split("T")[0];
        const sourceData = source.toJSON();

        const clonedData: ColorPalette = {
            ...sourceData,
            "palette-name": newPaletteName,
            "date-created": today,
            version: "1.0.0",
            collection: {
                ...sourceData.collection,
                "color-files": [...sourceData.collection["color-files"]]
            }
        };

        if (newAuthor) {
            clonedData.author = newAuthor;
        }

        return new ColorPaletteModel(clonedData);
    }

    // Merge multiple palettes into one
    mergePalettes(
        palettes: ColorPaletteModel[],
        options: CreatePaletteOptions
    ): ColorPaletteModel {
        const merged = this.createPalette(options);

        for (const palette of palettes) {
            for (const colorFile of palette.getColorFiles()) {
                // Avoid duplicates
                const existing = merged.getColorFiles().find(
                    (f) => f["file-path"] === colorFile["file-path"]
                );
                if (!existing) {
                    merged.addColorFile({ ...colorFile });
                }
            }
        }

        return merged;
    }

    // Export palette summary
    getSummary(
        palette: ColorPaletteModel,
        baseDir: string = "./data"
    ): {
        name: string;
        version: string;
        author: string;
        fileCount: number;
        colorCount: number;
        families: COLOR_FAMILY[];
        familyStats: Record<string, number>;
    } {
        const familyStats: Record<string, number> = {};
        for (const ref of palette.getColorFiles()) {
            const family = ref["color-family"];
            familyStats[family] = (familyStats[family] || 0) + 1;
        }

        return {
            name: palette.paletteName,
            version: palette.version,
            author: palette.author,
            fileCount: palette.getColorFileCount(),
            colorCount: this.getTotalColorCount(palette, baseDir),
            families: palette.getColorFamilies(),
            familyStats
        };
    }

    // Validate a palette file
    validateFile(
        filePath: string
    ): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validateFile(filePath, PALETTE_SCHEMA);
    }
}

// Export default repository instance
export const colorPaletteRepository = new ColorPaletteRepository();
