/**
 * Color Code Format Model
 * Provides utilities for working with color code formats and conversions.
 * Uses enums and types from ts-color-types.
 */

import {
    COLOR_CODE_SYSTEM_NAME,
    COLOR_CODE_FORMAT_STRING
} from "../ts-color-types/color-enums";

import type {
    HexValues,
    RgbValues,
    HslValues,
    CmykValues,
    ColorFormatString
} from "../ts-color-types/color-types-index.d";

import { ColorModel } from "./color";

/**
 * ColorCodeFormatModel class for working with color code formats
 */
export class ColorCodeFormatModel {
    private systemName: COLOR_CODE_SYSTEM_NAME;
    private formatString: COLOR_CODE_FORMAT_STRING;

    constructor(systemName: COLOR_CODE_SYSTEM_NAME) {
        this.systemName = systemName;
        this.formatString = this.getFormatString(systemName);
    }

    // Get system name
    getSystemName(): COLOR_CODE_SYSTEM_NAME {
        return this.systemName;
    }

    // Get format string template
    getFormatTemplate(): COLOR_CODE_FORMAT_STRING {
        return this.formatString;
    }

    // Get ColorFormatString object
    toColorFormatString(): ColorFormatString {
        return {
            name: this.systemName,
            format: this.formatString
        };
    }

    // Get the format string for a system name
    private getFormatString(name: COLOR_CODE_SYSTEM_NAME): COLOR_CODE_FORMAT_STRING {
        const mapping: Record<COLOR_CODE_SYSTEM_NAME, COLOR_CODE_FORMAT_STRING> = {
            [COLOR_CODE_SYSTEM_NAME.HEX3]: COLOR_CODE_FORMAT_STRING.HEX3,
            [COLOR_CODE_SYSTEM_NAME.HEX6]: COLOR_CODE_FORMAT_STRING.HEX6,
            [COLOR_CODE_SYSTEM_NAME.HEX8]: COLOR_CODE_FORMAT_STRING.HEX8,
            [COLOR_CODE_SYSTEM_NAME.RGB]: COLOR_CODE_FORMAT_STRING.RGB,
            [COLOR_CODE_SYSTEM_NAME.HSL]: COLOR_CODE_FORMAT_STRING.HSL,
            [COLOR_CODE_SYSTEM_NAME.CMYK]: COLOR_CODE_FORMAT_STRING.CMYK
        };
        return mapping[name];
    }
}

/**
 * ColorCodeFormatter for formatting color values to strings
 */
export class ColorCodeFormatter {
    // Format hex values to string
    formatHex(values: HexValues, includeHash: boolean = true): string {
        const prefix = includeHash ? "#" : "";
        return `${prefix}${values.r1}${values.r2}${values.g1}${values.g2}${values.b1}${values.b2}`;
    }

    // Format hex values with alpha to string
    formatHexWithAlpha(values: HexValues, includeHash: boolean = true): string {
        const prefix = includeHash ? "#" : "";
        const alpha = values.a1 && values.a2 ? `${values.a1}${values.a2}` : "FF";
        return `${prefix}${values.r1}${values.r2}${values.g1}${values.g2}${values.b1}${values.b2}${alpha}`;
    }

    // Format hex3 (shorthand hex)
    formatHex3(values: HexValues, includeHash: boolean = true): string {
        const prefix = includeHash ? "#" : "";
        return `${prefix}${values.r1}${values.g1}${values.b1}`;
    }

    // Format RGB values to string
    formatRgb(values: RgbValues): string {
        return `rgb(${values.r}, ${values.g}, ${values.b})`;
    }

    // Format RGBA values to string
    formatRgba(values: RgbValues, alpha: number = 1): string {
        return `rgba(${values.r}, ${values.g}, ${values.b}, ${alpha})`;
    }

    // Format HSL values to string
    formatHsl(values: HslValues): string {
        return `hsl(${values.h}, ${values.s}%, ${values.l}%)`;
    }

    // Format HSLA values to string
    formatHsla(values: HslValues, alpha: number = 1): string {
        return `hsla(${values.h}, ${values.s}%, ${values.l}%, ${alpha})`;
    }

    // Format CMYK values to string
    formatCmyk(values: CmykValues): string {
        return `cmyk(${values.c}%, ${values.m}%, ${values.y}%, ${values.k}%)`;
    }

    // Format color to specified system
    formatColor(
        color: ColorModel,
        system: COLOR_CODE_SYSTEM_NAME
    ): string | null {
        const codes = color.colorCodes;

        switch (system) {
            case COLOR_CODE_SYSTEM_NAME.HEX3:
                if (codes.hex?.values) {
                    return this.formatHex3(codes.hex.values);
                }
                break;
            case COLOR_CODE_SYSTEM_NAME.HEX6:
                if (codes.hex?.values) {
                    return this.formatHex(codes.hex.values);
                }
                break;
            case COLOR_CODE_SYSTEM_NAME.HEX8:
                if (codes.hex?.values) {
                    return this.formatHexWithAlpha(codes.hex.values);
                }
                break;
            case COLOR_CODE_SYSTEM_NAME.RGB:
                if (codes.rgb?.values) {
                    return this.formatRgb(codes.rgb.values);
                }
                break;
            case COLOR_CODE_SYSTEM_NAME.HSL:
                if (codes.hsl?.values) {
                    return this.formatHsl(codes.hsl.values);
                }
                break;
            case COLOR_CODE_SYSTEM_NAME.CMYK:
                if (codes.cmyk?.values) {
                    return this.formatCmyk(codes.cmyk.values);
                }
                break;
        }

        return null;
    }

    // Get all formatted values for a color
    getAllFormats(color: ColorModel): Record<COLOR_CODE_SYSTEM_NAME, string | null> {
        return {
            [COLOR_CODE_SYSTEM_NAME.HEX3]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.HEX3),
            [COLOR_CODE_SYSTEM_NAME.HEX6]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.HEX6),
            [COLOR_CODE_SYSTEM_NAME.HEX8]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.HEX8),
            [COLOR_CODE_SYSTEM_NAME.RGB]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.RGB),
            [COLOR_CODE_SYSTEM_NAME.HSL]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.HSL),
            [COLOR_CODE_SYSTEM_NAME.CMYK]: this.formatColor(color, COLOR_CODE_SYSTEM_NAME.CMYK)
        };
    }
}

/**
 * ColorCodeParser for parsing color strings to values
 */
export class ColorCodeParser {
    // Parse hex string to HexValues
    parseHex(hex: string): HexValues | null {
        const cleanHex = hex.replace("#", "").toUpperCase();

        if (cleanHex.length === 3) {
            // Expand shorthand hex
            return {
                r1: cleanHex[0],
                r2: cleanHex[0],
                g1: cleanHex[1],
                g2: cleanHex[1],
                b1: cleanHex[2],
                b2: cleanHex[2],
                a1: "F",
                a2: "F"
            };
        }

        if (cleanHex.length === 6) {
            return {
                r1: cleanHex[0],
                r2: cleanHex[1],
                g1: cleanHex[2],
                g2: cleanHex[3],
                b1: cleanHex[4],
                b2: cleanHex[5],
                a1: "F",
                a2: "F"
            };
        }

        if (cleanHex.length === 8) {
            return {
                r1: cleanHex[0],
                r2: cleanHex[1],
                g1: cleanHex[2],
                g2: cleanHex[3],
                b1: cleanHex[4],
                b2: cleanHex[5],
                a1: cleanHex[6],
                a2: cleanHex[7]
            };
        }

        return null;
    }

    // Parse RGB string to RgbValues
    parseRgb(rgb: string): RgbValues | null {
        const match = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }
        return null;
    }

    // Parse HSL string to HslValues
    parseHsl(hsl: string): HslValues | null {
        const match = hsl.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
        if (match) {
            return {
                h: parseInt(match[1], 10),
                s: parseInt(match[2], 10),
                l: parseInt(match[3], 10)
            };
        }
        return null;
    }

    // Parse CMYK string to CmykValues
    parseCmyk(cmyk: string): CmykValues | null {
        const match = cmyk.match(/cmyk\s*\(\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
        if (match) {
            return {
                c: parseInt(match[1], 10),
                m: parseInt(match[2], 10),
                y: parseInt(match[3], 10),
                k: parseInt(match[4], 10)
            };
        }
        return null;
    }

    // Detect color format from string
    detectFormat(colorString: string): COLOR_CODE_SYSTEM_NAME | null {
        const trimmed = colorString.trim().toLowerCase();

        if (trimmed.startsWith("#")) {
            const hexPart = trimmed.slice(1);
            if (hexPart.length === 3) return COLOR_CODE_SYSTEM_NAME.HEX3;
            if (hexPart.length === 6) return COLOR_CODE_SYSTEM_NAME.HEX6;
            if (hexPart.length === 8) return COLOR_CODE_SYSTEM_NAME.HEX8;
        }

        if (trimmed.startsWith("rgb")) {
            return COLOR_CODE_SYSTEM_NAME.RGB;
        }

        if (trimmed.startsWith("hsl")) {
            return COLOR_CODE_SYSTEM_NAME.HSL;
        }

        if (trimmed.startsWith("cmyk")) {
            return COLOR_CODE_SYSTEM_NAME.CMYK;
        }

        // Check if it's a hex without #
        if (/^[0-9a-f]{3}$/i.test(trimmed)) return COLOR_CODE_SYSTEM_NAME.HEX3;
        if (/^[0-9a-f]{6}$/i.test(trimmed)) return COLOR_CODE_SYSTEM_NAME.HEX6;
        if (/^[0-9a-f]{8}$/i.test(trimmed)) return COLOR_CODE_SYSTEM_NAME.HEX8;

        return null;
    }

    // Parse any color string automatically
    parseAuto(colorString: string): {
        format: COLOR_CODE_SYSTEM_NAME;
        hex?: HexValues;
        rgb?: RgbValues;
        hsl?: HslValues;
        cmyk?: CmykValues;
    } | null {
        const format = this.detectFormat(colorString);
        if (!format) return null;

        switch (format) {
            case COLOR_CODE_SYSTEM_NAME.HEX3:
            case COLOR_CODE_SYSTEM_NAME.HEX6:
            case COLOR_CODE_SYSTEM_NAME.HEX8:
                const hex = this.parseHex(colorString);
                return hex ? { format, hex } : null;

            case COLOR_CODE_SYSTEM_NAME.RGB:
                const rgb = this.parseRgb(colorString);
                return rgb ? { format, rgb } : null;

            case COLOR_CODE_SYSTEM_NAME.HSL:
                const hsl = this.parseHsl(colorString);
                return hsl ? { format, hsl } : null;

            case COLOR_CODE_SYSTEM_NAME.CMYK:
                const cmyk = this.parseCmyk(colorString);
                return cmyk ? { format, cmyk } : null;
        }

        return null;
    }
}

/**
 * ColorCodeConverter for converting between color systems
 */
export class ColorCodeConverter {
    // Convert RGB to HSL
    rgbToHsl(rgb: RgbValues): HslValues {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

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
            l: Math.round(l * 100)
        };
    }

    // Convert HSL to RGB
    hslToRgb(hsl: HslValues): RgbValues {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let r: number, g: number, b: number;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // Convert RGB to CMYK
    rgbToCmyk(rgb: RgbValues): CmykValues {
        if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        const rRatio = rgb.r / 255;
        const gRatio = rgb.g / 255;
        const bRatio = rgb.b / 255;

        const k = 1 - Math.max(rRatio, gRatio, bRatio);
        const c = (1 - rRatio - k) / (1 - k);
        const m = (1 - gRatio - k) / (1 - k);
        const y = (1 - bRatio - k) / (1 - k);

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Convert CMYK to RGB
    cmykToRgb(cmyk: CmykValues): RgbValues {
        const c = cmyk.c / 100;
        const m = cmyk.m / 100;
        const y = cmyk.y / 100;
        const k = cmyk.k / 100;

        return {
            r: Math.round(255 * (1 - c) * (1 - k)),
            g: Math.round(255 * (1 - m) * (1 - k)),
            b: Math.round(255 * (1 - y) * (1 - k))
        };
    }

    // Convert RGB to Hex
    rgbToHex(rgb: RgbValues): HexValues {
        const toHex = (n: number): string => {
            const hex = Math.max(0, Math.min(255, n)).toString(16).toUpperCase();
            return hex.padStart(2, "0");
        };

        const rHex = toHex(rgb.r);
        const gHex = toHex(rgb.g);
        const bHex = toHex(rgb.b);

        return {
            r1: rHex[0],
            r2: rHex[1],
            g1: gHex[0],
            g2: gHex[1],
            b1: bHex[0],
            b2: bHex[1],
            a1: "F",
            a2: "F"
        };
    }

    // Convert Hex to RGB
    hexToRgb(hex: HexValues): RgbValues {
        return {
            r: parseInt(`${hex.r1}${hex.r2}`, 16),
            g: parseInt(`${hex.g1}${hex.g2}`, 16),
            b: parseInt(`${hex.b1}${hex.b2}`, 16)
        };
    }

    // Convert any format to all formats
    convertToAll(
        value: HexValues | RgbValues | HslValues | CmykValues,
        sourceFormat: COLOR_CODE_SYSTEM_NAME
    ): { hex: HexValues; rgb: RgbValues; hsl: HslValues; cmyk: CmykValues } {
        let rgb: RgbValues;

        // First convert to RGB
        switch (sourceFormat) {
            case COLOR_CODE_SYSTEM_NAME.HEX3:
            case COLOR_CODE_SYSTEM_NAME.HEX6:
            case COLOR_CODE_SYSTEM_NAME.HEX8:
                rgb = this.hexToRgb(value as HexValues);
                break;
            case COLOR_CODE_SYSTEM_NAME.RGB:
                rgb = value as RgbValues;
                break;
            case COLOR_CODE_SYSTEM_NAME.HSL:
                rgb = this.hslToRgb(value as HslValues);
                break;
            case COLOR_CODE_SYSTEM_NAME.CMYK:
                rgb = this.cmykToRgb(value as CmykValues);
                break;
            default:
                throw new Error(`Unknown source format: ${sourceFormat}`);
        }

        // Now convert RGB to all other formats
        return {
            hex: this.rgbToHex(rgb),
            rgb,
            hsl: this.rgbToHsl(rgb),
            cmyk: this.rgbToCmyk(rgb)
        };
    }
}

// Export default instances
export const colorCodeFormatter = new ColorCodeFormatter();
export const colorCodeParser = new ColorCodeParser();
export const colorCodeConverter = new ColorCodeConverter();

// Export utility functions
export function getAllColorSystems(): COLOR_CODE_SYSTEM_NAME[] {
    return Object.values(COLOR_CODE_SYSTEM_NAME);
}

export function getAllFormatStrings(): COLOR_CODE_FORMAT_STRING[] {
    return Object.values(COLOR_CODE_FORMAT_STRING);
}
