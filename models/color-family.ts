/**
 * Color Family Model
 * Provides utilities for working with color families and classification.
 * Uses the COLOR_FAMILY enum from ts-color-types.
 */

import { COLOR_FAMILY } from "../ts-color-types/color-enums";
import type { HslValues } from "../ts-color-types/color-types-index.d";
import { ColorModel } from "./color";

/**
 * Color family classification thresholds based on HSL values
 */
interface FamilyThreshold {
    family: COLOR_FAMILY;
    hueMin: number;
    hueMax: number;
    satMin?: number;
    satMax?: number;
    lightMin?: number;
    lightMax?: number;
}

/**
 * Family classification rules
 * These thresholds are approximations and can be adjusted
 */
const FAMILY_THRESHOLDS: FamilyThreshold[] = [
    // Achromatic colors (very low saturation)
    { family: COLOR_FAMILY.WHITE, hueMin: 0, hueMax: 360, satMax: 10, lightMin: 90 },
    { family: COLOR_FAMILY.BLACK, hueMin: 0, hueMax: 360, satMax: 10, lightMax: 10 },
    { family: COLOR_FAMILY.GREY, hueMin: 0, hueMax: 360, satMax: 10, lightMin: 10, lightMax: 90 },

    // Chromatic colors (by hue ranges)
    { family: COLOR_FAMILY.RED, hueMin: 0, hueMax: 15, satMin: 10 },
    { family: COLOR_FAMILY.RED, hueMin: 345, hueMax: 360, satMin: 10 },
    { family: COLOR_FAMILY.ORANGE, hueMin: 15, hueMax: 45, satMin: 10 },
    { family: COLOR_FAMILY.YELLOW, hueMin: 45, hueMax: 70, satMin: 10 },
    { family: COLOR_FAMILY.GREEN, hueMin: 70, hueMax: 165, satMin: 10 },
    { family: COLOR_FAMILY.BLUE, hueMin: 165, hueMax: 255, satMin: 10 },
    { family: COLOR_FAMILY.PURPLE, hueMin: 255, hueMax: 290, satMin: 10 },
    { family: COLOR_FAMILY.PINK, hueMin: 290, hueMax: 345, satMin: 10 },

    // Brown is a special case (low saturation orange/red with low lightness)
    { family: COLOR_FAMILY.BROWN, hueMin: 0, hueMax: 45, satMin: 10, satMax: 60, lightMax: 50 }
];

/**
 * ColorFamilyModel class for working with color family classification
 */
export class ColorFamilyModel {
    private family: COLOR_FAMILY;

    constructor(family: COLOR_FAMILY) {
        this.family = family;
    }

    // Get the family
    getFamily(): COLOR_FAMILY {
        return this.family;
    }

    // Get the display name
    getDisplayName(): string {
        return this.family;
    }

    // Get the short name (without "Shades")
    getShortName(): string {
        return this.family.replace(" Shades", "");
    }

    // Get the enum key
    getEnumKey(): string {
        const entries = Object.entries(COLOR_FAMILY);
        for (const [key, value] of entries) {
            if (value === this.family) {
                return key;
            }
        }
        return "OTHER";
    }

    // Check if this is an achromatic family
    isAchromatic(): boolean {
        return [
            COLOR_FAMILY.WHITE,
            COLOR_FAMILY.BLACK,
            COLOR_FAMILY.GREY
        ].includes(this.family);
    }

    // Check if this is a warm color family
    isWarm(): boolean {
        return [
            COLOR_FAMILY.RED,
            COLOR_FAMILY.ORANGE,
            COLOR_FAMILY.YELLOW,
            COLOR_FAMILY.BROWN
        ].includes(this.family);
    }

    // Check if this is a cool color family
    isCool(): boolean {
        return [
            COLOR_FAMILY.GREEN,
            COLOR_FAMILY.BLUE,
            COLOR_FAMILY.PURPLE
        ].includes(this.family);
    }

    // Get complementary family (approximate)
    getComplementaryFamily(): COLOR_FAMILY {
        const complements: Record<COLOR_FAMILY, COLOR_FAMILY> = {
            [COLOR_FAMILY.RED]: COLOR_FAMILY.GREEN,
            [COLOR_FAMILY.ORANGE]: COLOR_FAMILY.BLUE,
            [COLOR_FAMILY.YELLOW]: COLOR_FAMILY.PURPLE,
            [COLOR_FAMILY.GREEN]: COLOR_FAMILY.RED,
            [COLOR_FAMILY.BLUE]: COLOR_FAMILY.ORANGE,
            [COLOR_FAMILY.PURPLE]: COLOR_FAMILY.YELLOW,
            [COLOR_FAMILY.PINK]: COLOR_FAMILY.GREEN,
            [COLOR_FAMILY.BROWN]: COLOR_FAMILY.BLUE,
            [COLOR_FAMILY.GREY]: COLOR_FAMILY.GREY,
            [COLOR_FAMILY.WHITE]: COLOR_FAMILY.BLACK,
            [COLOR_FAMILY.BLACK]: COLOR_FAMILY.WHITE,
            [COLOR_FAMILY.OTHER]: COLOR_FAMILY.OTHER
        };
        return complements[this.family];
    }

    // Get analogous families
    getAnalogousFamilies(): COLOR_FAMILY[] {
        const colorWheel: COLOR_FAMILY[] = [
            COLOR_FAMILY.RED,
            COLOR_FAMILY.ORANGE,
            COLOR_FAMILY.YELLOW,
            COLOR_FAMILY.GREEN,
            COLOR_FAMILY.BLUE,
            COLOR_FAMILY.PURPLE,
            COLOR_FAMILY.PINK
        ];

        const index = colorWheel.indexOf(this.family);
        if (index === -1) {
            return [];
        }

        const prev = colorWheel[(index - 1 + colorWheel.length) % colorWheel.length];
        const next = colorWheel[(index + 1) % colorWheel.length];

        return [prev, next];
    }
}

/**
 * ColorFamilyClassifier for classifying colors into families
 */
export class ColorFamilyClassifier {
    // Classify a color from HSL values
    classifyFromHsl(hsl: HslValues): COLOR_FAMILY {
        const { h, s, l } = hsl;

        // First check achromatic colors
        if (s <= 10) {
            if (l >= 90) return COLOR_FAMILY.WHITE;
            if (l <= 10) return COLOR_FAMILY.BLACK;
            return COLOR_FAMILY.GREY;
        }

        // Check for brown (special case)
        if (h >= 0 && h <= 45 && s >= 10 && s <= 60 && l <= 50) {
            return COLOR_FAMILY.BROWN;
        }

        // Check chromatic colors by hue
        for (const threshold of FAMILY_THRESHOLDS) {
            if (this.matchesThreshold(hsl, threshold)) {
                // Skip achromatic thresholds for chromatic colors
                if ([COLOR_FAMILY.WHITE, COLOR_FAMILY.BLACK, COLOR_FAMILY.GREY].includes(threshold.family)) {
                    continue;
                }
                return threshold.family;
            }
        }

        return COLOR_FAMILY.OTHER;
    }

    // Classify a color model
    classifyColor(color: ColorModel): COLOR_FAMILY {
        const colorCodes = color.colorCodes;
        if (!colorCodes.hsl?.values) {
            // If no HSL values, try to determine from existing color family
            return color.colorFamily || COLOR_FAMILY.OTHER;
        }

        return this.classifyFromHsl(colorCodes.hsl.values);
    }

    // Classify multiple colors
    classifyColors(colors: ColorModel[]): Map<ColorModel, COLOR_FAMILY> {
        const results = new Map<ColorModel, COLOR_FAMILY>();
        for (const color of colors) {
            results.set(color, this.classifyColor(color));
        }
        return results;
    }

    // Group colors by family
    groupByFamily(colors: ColorModel[]): Map<COLOR_FAMILY, ColorModel[]> {
        const groups = new Map<COLOR_FAMILY, ColorModel[]>();

        // Initialize all families
        for (const family of Object.values(COLOR_FAMILY)) {
            groups.set(family, []);
        }

        // Classify and group
        for (const color of colors) {
            const family = this.classifyColor(color);
            groups.get(family)!.push(color);
        }

        return groups;
    }

    // Get family distribution statistics
    getFamilyDistribution(colors: ColorModel[]): Map<COLOR_FAMILY, number> {
        const stats = new Map<COLOR_FAMILY, number>();
        const groups = this.groupByFamily(colors);

        groups.forEach((colorArray, family) => {
            stats.set(family, colorArray.length);
        });

        return stats;
    }

    // Get the dominant family (most colors)
    getDominantFamily(colors: ColorModel[]): COLOR_FAMILY | undefined {
        const stats = this.getFamilyDistribution(colors);
        let maxCount = 0;
        let dominant: COLOR_FAMILY | undefined;

        stats.forEach((count, family) => {
            if (count > maxCount) {
                maxCount = count;
                dominant = family;
            }
        });

        return dominant;
    }

    // Check if HSL matches a threshold
    private matchesThreshold(hsl: HslValues, threshold: FamilyThreshold): boolean {
        const { h, s, l } = hsl;

        // Check hue range
        if (h < threshold.hueMin || h > threshold.hueMax) {
            return false;
        }

        // Check saturation range
        if (threshold.satMin !== undefined && s < threshold.satMin) {
            return false;
        }
        if (threshold.satMax !== undefined && s > threshold.satMax) {
            return false;
        }

        // Check lightness range
        if (threshold.lightMin !== undefined && l < threshold.lightMin) {
            return false;
        }
        if (threshold.lightMax !== undefined && l > threshold.lightMax) {
            return false;
        }

        return true;
    }
}

/**
 * Utility functions for color family operations
 */

// Get all color families
export function getAllColorFamilies(): COLOR_FAMILY[] {
    return Object.values(COLOR_FAMILY);
}

// Get chromatic color families (excludes white, black, grey, other)
export function getChromaticFamilies(): COLOR_FAMILY[] {
    return [
        COLOR_FAMILY.RED,
        COLOR_FAMILY.ORANGE,
        COLOR_FAMILY.YELLOW,
        COLOR_FAMILY.GREEN,
        COLOR_FAMILY.BLUE,
        COLOR_FAMILY.PURPLE,
        COLOR_FAMILY.PINK,
        COLOR_FAMILY.BROWN
    ];
}

// Get achromatic color families
export function getAchromaticFamilies(): COLOR_FAMILY[] {
    return [
        COLOR_FAMILY.WHITE,
        COLOR_FAMILY.BLACK,
        COLOR_FAMILY.GREY
    ];
}

// Get color family by name (case insensitive)
export function getColorFamilyByName(name: string): COLOR_FAMILY | undefined {
    const lowerName = name.toLowerCase();
    for (const family of Object.values(COLOR_FAMILY)) {
        if (family.toLowerCase().includes(lowerName)) {
            return family;
        }
    }
    return undefined;
}

// Export default classifier instance
export const colorFamilyClassifier = new ColorFamilyClassifier();
