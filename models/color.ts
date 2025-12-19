/**
 * Color Model
 * Implements the color file schema with full CRUD operations and color manipulation utilities.
 * Uses types from ts-color-types.
 */

import { JsonMaker } from "../json-maker";
import { COLOR_FAMILY } from "../ts-color-types/color-enums";
import type {
    HexValues,
    RgbValues,
    HslValues,
    CmykValues,
    ColorName,
    NamingSource
} from "../ts-color-types/color-types-index.d";

// Schema path
const COLOR_SCHEMA = "color-file-schema.json";

// Color codes structure matching JSON schema (differs slightly from .d.ts for file format)
export interface ColorCodesData {
    hex?: { values: HexValues };
    rgb?: { values: RgbValues };
    hsl?: { values: HslValues };
    cmyk?: { values: CmykValues };
}

// Color data interface matching the JSON file schema
export interface ColorData {
    "unique-color-id": string;
    name: string;
    "other-names"?: ColorName[];
    "naming-source"?: string;
    nickname?: string;
    "color-family"?: COLOR_FAMILY;
    "color-codes": ColorCodesData;
    description?: string;
}

/**
 * ColorModel class for working with color data
 */
export class ColorModel {
    private jsonMaker: JsonMaker;
    private data: ColorData;

    constructor(data: ColorData, schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.data = data;
    }

    // Getters
    get id(): string {
        return this.data["unique-color-id"];
    }

    get name(): string {
        return this.data.name;
    }

    get otherNames(): ColorName[] {
        return this.data["other-names"] || [];
    }

    get namingSource(): string | undefined {
        return this.data["naming-source"];
    }

    get nickname(): string | undefined {
        return this.data.nickname;
    }

    get colorFamily(): COLOR_FAMILY | undefined {
        return this.data["color-family"];
    }

    get colorCodes(): ColorCodesData {
        return this.data["color-codes"];
    }

    get description(): string | undefined {
        return this.data.description;
    }

    // Setters
    set name(value: string) {
        this.data.name = value;
    }

    set nickname(value: string | undefined) {
        this.data.nickname = value;
    }

    set colorFamily(value: COLOR_FAMILY | undefined) {
        this.data["color-family"] = value;
    }

    set description(value: string | undefined) {
        this.data.description = value;
    }

    // Get raw data
    toJSON(): ColorData {
        return { ...this.data };
    }

    // Hex string getters
    getHexString(includeHash: boolean = true): string {
        const hex = this.data["color-codes"].hex?.values;
        if (!hex) return "";
        const prefix = includeHash ? "#" : "";
        return `${prefix}${hex.r1}${hex.r2}${hex.g1}${hex.g2}${hex.b1}${hex.b2}`;
    }

    getHexWithAlpha(includeHash: boolean = true): string {
        const hex = this.data["color-codes"].hex?.values;
        if (!hex) return "";
        const prefix = includeHash ? "#" : "";
        const alpha = hex.a1 && hex.a2 ? `${hex.a1}${hex.a2}` : "FF";
        return `${prefix}${hex.r1}${hex.r2}${hex.g1}${hex.g2}${hex.b1}${hex.b2}${alpha}`;
    }

    // RGB string getters
    getRgbString(): string {
        const rgb = this.data["color-codes"].rgb?.values;
        if (!rgb) return "";
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    getRgbaString(alpha: number = 1): string {
        const rgb = this.data["color-codes"].rgb?.values;
        if (!rgb) return "";
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    // HSL string getters
    getHslString(): string {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return "";
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    getHslaString(alpha: number = 1): string {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return "";
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
    }

    // CMYK string getter
    getCmykString(): string {
        const cmyk = this.data["color-codes"].cmyk?.values;
        if (!cmyk) return "";
        return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    }

    // Add alternative name
    addOtherName(name: string, source: string | NamingSource): void {
        if (!this.data["other-names"]) {
            this.data["other-names"] = [];
        }
        this.data["other-names"].push({ name, source });
    }

    // Remove alternative name
    removeOtherName(name: string): boolean {
        if (!this.data["other-names"]) return false;
        const index = this.data["other-names"].findIndex((n) => n.name === name);
        if (index !== -1) {
            this.data["other-names"].splice(index, 1);
            return true;
        }
        return false;
    }

    // Validate against schema
    validate(): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validate([this.data], COLOR_SCHEMA);
    }

    // Color manipulation utilities
    lighten(amount: number): HslValues | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return {
            h: hsl.h,
            s: hsl.s,
            l: Math.min(100, hsl.l + amount),
        };
    }

    darken(amount: number): HslValues | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return {
            h: hsl.h,
            s: hsl.s,
            l: Math.max(0, hsl.l - amount),
        };
    }

    saturate(amount: number): HslValues | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return {
            h: hsl.h,
            s: Math.min(100, hsl.s + amount),
            l: hsl.l,
        };
    }

    desaturate(amount: number): HslValues | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return {
            h: hsl.h,
            s: Math.max(0, hsl.s - amount),
            l: hsl.l,
        };
    }

    getComplementary(): HslValues | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return {
            h: (hsl.h + 180) % 360,
            s: hsl.s,
            l: hsl.l,
        };
    }

    getTriadic(): [HslValues, HslValues] | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return [
            { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l },
            { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l },
        ];
    }

    getAnalogous(angle: number = 30): [HslValues, HslValues] | null {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return null;
        return [
            { h: (hsl.h + angle + 360) % 360, s: hsl.s, l: hsl.l },
            { h: (hsl.h - angle + 360) % 360, s: hsl.s, l: hsl.l },
        ];
    }

    // Check if color is light or dark
    isLight(): boolean {
        const hsl = this.data["color-codes"].hsl?.values;
        if (!hsl) return true;
        return hsl.l > 50;
    }

    isDark(): boolean {
        return !this.isLight();
    }

    // Get contrast color (black or white)
    getContrastColor(): string {
        return this.isLight() ? "#000000" : "#FFFFFF";
    }
}

/**
 * ColorRepository for managing color files
 */
export class ColorRepository {
    private jsonMaker: JsonMaker;

    constructor(schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
    }

    // Load colors from a file
    loadFromFile(filePath: string): ColorModel[] {
        const validation = this.jsonMaker.validateFile(filePath, COLOR_SCHEMA);
        if (!validation.valid) {
            throw new Error(`Invalid color file: ${validation.errors.map((e) => e.message).join(", ")}`);
        }

        const data = this.jsonMaker.readData({ type: "file", path: filePath }) as ColorData[];
        return data.map((colorData) => new ColorModel(colorData));
    }

    // Save colors to a file
    saveToFile(colors: ColorModel[], filePath: string): void {
        const data = colors.map((color) => color.toJSON());
        const validation = this.jsonMaker.validate(data, COLOR_SCHEMA);

        if (!validation.valid) {
            throw new Error(`Invalid color data: ${validation.errors.map((e) => e.message).join(", ")}`);
        }

        this.jsonMaker.writeJson(data, filePath);
    }

    // Find color by ID
    findById(colors: ColorModel[], id: string): ColorModel | undefined {
        return colors.find((color) => color.id === id);
    }

    // Find colors by name (partial match)
    findByName(colors: ColorModel[], name: string): ColorModel[] {
        const lowerName = name.toLowerCase();
        return colors.filter((color) => color.name.toLowerCase().includes(lowerName));
    }

    // Find colors by family
    findByFamily(colors: ColorModel[], family: COLOR_FAMILY): ColorModel[] {
        return colors.filter((color) => color.colorFamily === family);
    }

    // Find colors by hex
    findByHex(colors: ColorModel[], hex: string): ColorModel | undefined {
        const normalizedHex = hex.replace("#", "").toUpperCase();
        return colors.find((color) => color.getHexString(false).toUpperCase() === normalizedHex);
    }

    // Create color from hex string
    createFromHex(hex: string, name: string): ColorModel {
        const cleanHex = hex.replace("#", "").toUpperCase();

        if (!/^[0-9A-F]{6}$/.test(cleanHex)) {
            throw new Error("Invalid hex color format. Expected 6 hex digits.");
        }

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        // Convert to HSL
        const hsl = this.rgbToHsl(r, g, b);

        // Convert to CMYK
        const cmyk = this.rgbToCmyk(r, g, b);

        // Generate unique ID
        const uniqueId = this.generateUniqueId(cleanHex);

        const colorData: ColorData = {
            "unique-color-id": uniqueId,
            name,
            "color-codes": {
                hex: {
                    values: {
                        r1: cleanHex[0],
                        r2: cleanHex[1],
                        g1: cleanHex[2],
                        g2: cleanHex[3],
                        b1: cleanHex[4],
                        b2: cleanHex[5],
                        a1: "F",
                        a2: "F",
                    },
                },
                rgb: { values: { r, g, b } },
                hsl: { values: hsl },
                cmyk: { values: cmyk },
            },
        };

        return new ColorModel(colorData);
    }

    // Convert RGB to HSL
    private rgbToHsl(r: number, g: number, b: number): HslValues {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;

        let h = 0;
        let s = 0;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    }

    // Convert RGB to CMYK
    private rgbToCmyk(r: number, g: number, b: number): CmykValues {
        if (r === 0 && g === 0 && b === 0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        const rRatio = r / 255;
        const gRatio = g / 255;
        const bRatio = b / 255;

        const k = 1 - Math.max(rRatio, gRatio, bRatio);
        const c = (1 - rRatio - k) / (1 - k);
        const m = (1 - gRatio - k) / (1 - k);
        const y = (1 - bRatio - k) / (1 - k);

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100),
        };
    }

    // Generate unique ID from hex
    private generateUniqueId(hex: string): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let id = "";
        const hexNum = parseInt(hex, 16);

        for (let i = 0; i < 8; i++) {
            const index = (hexNum >> (i * 4)) & 0x1f;
            id += chars[index % chars.length];
        }

        return id;
    }

    // Validate a color file
    validateFile(filePath: string): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validateFile(filePath, COLOR_SCHEMA);
    }
}

// Export default repository instance
export const colorRepository = new ColorRepository();
