/**
 * Color Collection Model
 * Implements the color collection schema with full CRUD operations.
 * Uses types from ts-color-types.
 */

import { JsonMaker } from "../json-maker";
import { COLOR_FAMILY } from "../ts-color-types/color-enums";
import type {
    ColorFileReference,
    PaletteCollection
} from "../ts-color-types/color-types-index.d";
import { ColorModel, ColorRepository } from "./color";

// Schema path
const COLLECTION_SCHEMA = "color-collection-schema.json";

/**
 * ColorCollectionModel class for working with color collection data
 */
export class ColorCollectionModel {
    private jsonMaker: JsonMaker;
    private data: PaletteCollection;

    constructor(data: PaletteCollection, schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.data = data;
    }

    // Getters
    get fileName(): string {
        return this.data["file-name"];
    }

    get schemaFile(): string {
        return this.data["schema-file"];
    }

    get description(): string {
        return this.data.description;
    }

    get colorFiles(): ColorFileReference[] {
        return this.data["color-files"];
    }

    get colorFileCount(): number {
        return this.data["color-files"].length;
    }

    // Setters
    set fileName(value: string) {
        this.data["file-name"] = value;
    }

    set schemaFile(value: string) {
        this.data["schema-file"] = value;
    }

    set description(value: string) {
        this.data.description = value;
    }

    // Get raw data
    toJSON(): PaletteCollection {
        return { ...this.data };
    }

    // Add a color file reference
    addColorFile(reference: ColorFileReference): void {
        this.data["color-files"].push(reference);
    }

    // Remove a color file reference by path
    removeColorFile(filePath: string): boolean {
        const index = this.data["color-files"].findIndex(
            (ref) => ref["file-path"] === filePath
        );
        if (index !== -1) {
            this.data["color-files"].splice(index, 1);
            return true;
        }
        return false;
    }

    // Find color file by path
    findColorFile(filePath: string): ColorFileReference | undefined {
        return this.data["color-files"].find(
            (ref) => ref["file-path"] === filePath
        );
    }

    // Get color files by family
    getColorFilesByFamily(family: COLOR_FAMILY): ColorFileReference[] {
        return this.data["color-files"].filter(
            (ref) => ref["color-family"] === family
        );
    }

    // Get all unique color families in the collection
    getColorFamilies(): COLOR_FAMILY[] {
        const families = new Set<COLOR_FAMILY>();
        for (const ref of this.data["color-files"]) {
            families.add(ref["color-family"] as COLOR_FAMILY);
        }
        return Array.from(families);
    }

    // Get family statistics
    getFamilyStats(): Map<COLOR_FAMILY, number> {
        const stats = new Map<COLOR_FAMILY, number>();
        for (const ref of this.data["color-files"]) {
            const family = ref["color-family"] as COLOR_FAMILY;
            stats.set(family, (stats.get(family) || 0) + 1);
        }
        return stats;
    }

    // Update a color file reference
    updateColorFile(
        filePath: string,
        updates: Partial<ColorFileReference>
    ): boolean {
        const ref = this.findColorFile(filePath);
        if (ref) {
            Object.assign(ref, updates);
            return true;
        }
        return false;
    }

    // Sort color files by family
    sortByFamily(): void {
        const familyOrder = Object.values(COLOR_FAMILY);
        this.data["color-files"].sort((a, b) => {
            const aIndex = familyOrder.indexOf(a["color-family"] as COLOR_FAMILY);
            const bIndex = familyOrder.indexOf(b["color-family"] as COLOR_FAMILY);
            return aIndex - bIndex;
        });
    }

    // Sort color files by path
    sortByPath(): void {
        this.data["color-files"].sort((a, b) =>
            a["file-path"].localeCompare(b["file-path"])
        );
    }

    // Validate against schema
    validate(): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validate([this.data], COLLECTION_SCHEMA);
    }
}

/**
 * ColorCollectionRepository for managing color collection files
 */
export class ColorCollectionRepository {
    private jsonMaker: JsonMaker;
    private colorRepository: ColorRepository;

    constructor(schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.colorRepository = new ColorRepository(schemaDir);
    }

    // Load collections from a file
    loadFromFile(filePath: string): ColorCollectionModel[] {
        const validation = this.jsonMaker.validateFile(filePath, COLLECTION_SCHEMA);
        if (!validation.valid) {
            throw new Error(
                `Invalid collection file: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        const data = this.jsonMaker.readData({
            type: "file",
            path: filePath
        }) as PaletteCollection[];
        return data.map((collectionData) => new ColorCollectionModel(collectionData));
    }

    // Save collections to a file
    saveToFile(collections: ColorCollectionModel[], filePath: string): void {
        const data = collections.map((collection) => collection.toJSON());
        const validation = this.jsonMaker.validate(data, COLLECTION_SCHEMA);

        if (!validation.valid) {
            throw new Error(
                `Invalid collection data: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        this.jsonMaker.writeJson(data, filePath);
    }

    // Create a new collection
    createCollection(
        fileName: string,
        schemaFile: string,
        description: string
    ): ColorCollectionModel {
        const collectionData: PaletteCollection = {
            "file-name": fileName,
            "schema-file": schemaFile,
            description,
            "color-files": []
        };
        return new ColorCollectionModel(collectionData);
    }

    // Find collection by file name
    findByFileName(
        collections: ColorCollectionModel[],
        fileName: string
    ): ColorCollectionModel | undefined {
        return collections.find((c) => c.fileName === fileName);
    }

    // Load all colors from a collection
    loadAllColors(
        collection: ColorCollectionModel,
        baseDir: string = "./data"
    ): Map<string, ColorModel[]> {
        const colorMap = new Map<string, ColorModel[]>();

        for (const ref of collection.colorFiles) {
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

    // Get total color count across all files
    getTotalColorCount(
        collection: ColorCollectionModel,
        baseDir: string = "./data"
    ): number {
        let count = 0;
        const colors = this.loadAllColors(collection, baseDir);
        colors.forEach((colorArray) => {
            count += colorArray.length;
        });
        return count;
    }

    // Add a color file to collection from existing file
    addColorFileFromPath(
        collection: ColorCollectionModel,
        filePath: string,
        colorFamily: COLOR_FAMILY,
        baseDir: string = "./data"
    ): void {
        // Validate the color file exists and is valid
        const fullPath = `${baseDir}/${filePath}`;
        const validation = this.colorRepository.validateFile(fullPath);
        if (!validation.valid) {
            throw new Error(
                `Invalid color file: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        const reference: ColorFileReference = {
            "file-path": filePath,
            "color-family": colorFamily
        };

        collection.addColorFile(reference);
    }

    // Merge multiple collections into one
    mergeCollections(
        collections: ColorCollectionModel[],
        newFileName: string,
        newDescription: string
    ): ColorCollectionModel {
        if (collections.length === 0) {
            throw new Error("Cannot merge empty collection array");
        }

        const schemaFile = collections[0].schemaFile;
        const merged = this.createCollection(newFileName, schemaFile, newDescription);

        for (const collection of collections) {
            for (const colorFile of collection.colorFiles) {
                // Avoid duplicates
                if (!merged.findColorFile(colorFile["file-path"])) {
                    merged.addColorFile({ ...colorFile });
                }
            }
        }

        return merged;
    }

    // Get all colors by family across a collection
    getColorsByFamily(
        collection: ColorCollectionModel,
        family: COLOR_FAMILY,
        baseDir: string = "./data"
    ): ColorModel[] {
        const familyFiles = collection.getColorFilesByFamily(family);
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

    // Validate a collection file
    validateFile(
        filePath: string
    ): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validateFile(filePath, COLLECTION_SCHEMA);
    }
}

// Export default repository instance
export const colorCollectionRepository = new ColorCollectionRepository();
