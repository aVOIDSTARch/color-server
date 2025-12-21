/**
 * Coolors Palette Converter
 *
 * Converts Coolors palette TypeScript files to color-server JSON format.
 * Uses the color-server models (ColorModel, ColorRepository, ColorPaletteModel, ColorPaletteRepository)
 * to create individual color JSON files and palette JSON files.
 *
 * Supports configurable output directories for flexible deployment.
 */

import * as fs from 'fs';
import * as path from 'path';

// Import color-server models and types
import { ColorModel, ColorRepository, ColorData, ColorCodesData } from './models/color';
import { ColorPaletteModel, ColorPaletteRepository } from './models/color-palette';
import { COLOR_FAMILY } from './ts-color-types/color-enums';
import type { ColorFileReference, CreatePaletteOptions } from './ts-color-types/color-types-index';

// Coolors Color interface (from palette files)
interface CoolorsColor {
    name: string;
    hex: string;
    rgb: [number, number, number];
    cmyk: [number, number, number, number];
    hsb: [number, number, number];
    hsl: [number, number, number];
    lab: [number, number, number];
}

// Configuration interface
export interface ConversionConfig {
    palettesDir: string;
    colorOutputDir: string;
    paletteOutputDir: string;
    schemaDir: string;
    colorFilePathPrefix: string;  // Prefix for color file references in palette
}

// Directory paths
const SCHEMA_DIR = path.join(__dirname, 'json-schema');
const PALETTES_DIR = path.join(__dirname, '..', 'code-files-coolors-co', 'coolors-palettes-typescript');

// Default configurations
export const COOLORS_SCHEMAS_CONFIG: ConversionConfig = {
    palettesDir: PALETTES_DIR,
    colorOutputDir: path.join(PALETTES_DIR, 'schemas', 'color-schemas'),
    paletteOutputDir: path.join(PALETTES_DIR, 'schemas', 'palette-schemas'),
    schemaDir: SCHEMA_DIR,
    colorFilePathPrefix: 'color-schemas/'
};

export const COLOR_SERVER_DATA_CONFIG: ConversionConfig = {
    palettesDir: PALETTES_DIR,
    colorOutputDir: path.join(__dirname, 'data', 'color-files'),
    paletteOutputDir: path.join(__dirname, 'data', 'palettes'),
    schemaDir: SCHEMA_DIR,
    colorFilePathPrefix: 'color-files/'
};

/**
 * Generate a unique ID from hex value
 */
function generateUniqueId(hex: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    const hexNum = parseInt(hex, 16);

    for (let i = 0; i < 8; i++) {
        const index = (hexNum >> (i * 4)) & 0x1f;
        id += chars[index % chars.length];
    }

    return id;
}

/**
 * Determine color family based on HSL values
 */
function determineColorFamily(hsl: [number, number, number]): COLOR_FAMILY {
    const [h, s, l] = hsl;

    // Check for achromatic colors first (low saturation)
    if (s <= 10) {
        if (l >= 90) return COLOR_FAMILY.WHITE;
        if (l <= 10) return COLOR_FAMILY.BLACK;
        return COLOR_FAMILY.GREY;
    }

    // Check for very light colors (could be white shades)
    if (l >= 95) return COLOR_FAMILY.WHITE;

    // Check for very dark colors (could be black shades)
    if (l <= 5) return COLOR_FAMILY.BLACK;

    // Determine by hue
    if (h >= 0 && h < 15) return COLOR_FAMILY.RED;
    if (h >= 15 && h < 45) return COLOR_FAMILY.ORANGE;
    if (h >= 45 && h < 70) return COLOR_FAMILY.YELLOW;
    if (h >= 70 && h < 165) return COLOR_FAMILY.GREEN;
    if (h >= 165 && h < 255) return COLOR_FAMILY.BLUE;
    if (h >= 255 && h < 290) return COLOR_FAMILY.PURPLE;
    if (h >= 290 && h < 335) return COLOR_FAMILY.PINK;
    if (h >= 335 && h <= 360) return COLOR_FAMILY.RED;

    // Check for browns (orange/yellow with low saturation and medium lightness)
    if (h >= 15 && h < 45 && s < 50 && l < 50) return COLOR_FAMILY.BROWN;

    return COLOR_FAMILY.OTHER;
}

/**
 * Convert a Coolors color to a ColorModel
 * Uses the pre-calculated values from Coolors instead of re-calculating
 */
function convertToColorModel(coolorsColor: CoolorsColor, paletteName: string, schemaDir: string): ColorModel {
    const hex = coolorsColor.hex.toUpperCase();
    const colorFamily = determineColorFamily(coolorsColor.hsl);

    const colorCodes: ColorCodesData = {
        hex: {
            values: {
                r1: hex[0],
                r2: hex[1],
                g1: hex[2],
                g2: hex[3],
                b1: hex[4],
                b2: hex[5],
                a1: 'F',
                a2: 'F'
            }
        },
        rgb: {
            values: {
                r: coolorsColor.rgb[0],
                g: coolorsColor.rgb[1],
                b: coolorsColor.rgb[2]
            }
        },
        hsl: {
            values: {
                h: coolorsColor.hsl[0],
                s: coolorsColor.hsl[1],
                l: coolorsColor.hsl[2]
            }
        },
        cmyk: {
            values: {
                c: coolorsColor.cmyk[0],
                m: coolorsColor.cmyk[1],
                y: coolorsColor.cmyk[2],
                k: coolorsColor.cmyk[3]
            }
        }
    };

    const colorData: ColorData = {
        'unique-color-id': generateUniqueId(hex),
        name: coolorsColor.name,
        'other-names': [{
            name: coolorsColor.name,
            source: {
                name: 'Coolors',
                url: 'https://coolors.co'
            }
        }],
        'naming-source': 'Coolors',
        nickname: '',
        'color-family': colorFamily,
        'color-codes': colorCodes,
        description: `A ${colorFamily.toLowerCase().replace(' shades', '')} color from the ${paletteName} palette.`
    };

    return new ColorModel(colorData, schemaDir);
}

/**
 * Convert filename to palette name
 */
function filenameToPaletteName(filename: string): string {
    return filename
        .replace('.ts', '')
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Slugify a name for filename
 */
function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Get all palette TypeScript files
 */
function getPaletteFiles(palettesDir: string): string[] {
    const files = fs.readdirSync(palettesDir);
    return files.filter((file: string) =>
        file.endsWith('.ts') &&
        !file.endsWith('.d.ts')
    );
}

/**
 * Parse a palette TypeScript file and extract colors
 */
function parsePaletteFile(palettesDir: string, filename: string): CoolorsColor[] {
    const filePath = path.join(palettesDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find the array in the file - it's the exported const
    const arrayMatch = content.match(/\[(\{[\s\S]*?\}(?:\s*,\s*\{[\s\S]*?\})*)\]/);
    if (!arrayMatch) {
        console.warn(`Could not parse colors from ${filename}`);
        return [];
    }

    try {
        const arrayContent = `[${arrayMatch[1]}]`;
        return JSON.parse(arrayContent) as CoolorsColor[];
    } catch (error) {
        console.error(`Error parsing ${filename}:`, error);
        return [];
    }
}

/**
 * Create a palette using ColorPaletteRepository
 */
function createPalette(paletteName: string, paletteRepository: ColorPaletteRepository): ColorPaletteModel {
    const slugName = slugify(paletteName);

    const options: CreatePaletteOptions = {
        paletteName,
        version: '1.0.0',
        author: 'Coolors.co',
        projectName: 'Coolors Palettes',
        projectUrl: 'https://coolors.co',
        description: `Color palette: ${paletteName}`,
        collectionFileName: `${slugName}-colors.json`,
        collectionDescription: `Collection of colors from the ${paletteName} palette`,
        schemaFile: 'color-file-schema.json'
    };

    return paletteRepository.createPalette(options);
}

/**
 * Convert all palettes with the given configuration
 */
export async function convertPalettes(config: ConversionConfig, label: string = ''): Promise<{ palettes: number; colors: number }> {
    const headerLabel = label ? ` [${label}]` : '';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Starting palette conversion${headerLabel}...`);
    console.log(`${'='.repeat(60)}\n`);
    console.log(`  Schema directory: ${config.schemaDir}`);
    console.log(`  Color output: ${config.colorOutputDir}`);
    console.log(`  Palette output: ${config.paletteOutputDir}\n`);

    // Initialize repositories
    const colorRepository = new ColorRepository(config.schemaDir);
    const paletteRepository = new ColorPaletteRepository(config.schemaDir);

    // Ensure output directories exist
    if (!fs.existsSync(config.colorOutputDir)) {
        fs.mkdirSync(config.colorOutputDir, { recursive: true });
    }
    if (!fs.existsSync(config.paletteOutputDir)) {
        fs.mkdirSync(config.paletteOutputDir, { recursive: true });
    }

    const paletteFiles = getPaletteFiles(config.palettesDir);
    console.log(`Found ${paletteFiles.length} palette files to convert.\n`);

    let totalColors = 0;
    let totalPalettes = 0;

    for (const filename of paletteFiles) {
        const paletteName = filenameToPaletteName(filename);
        console.log(`Processing: ${paletteName}`);

        const coolorsColors = parsePaletteFile(config.palettesDir, filename);
        if (coolorsColors.length === 0) {
            console.log(`  Skipping - no colors found\n`);
            continue;
        }

        // Create palette using the repository
        const palette = createPalette(paletteName, paletteRepository);

        // Convert and save each color
        for (const coolorsColor of coolorsColors) {
            const colorModel = convertToColorModel(coolorsColor, paletteName, config.schemaDir);
            const colorFilename = `${slugify(coolorsColor.name)}.json`;
            const colorFilePath = path.join(config.colorOutputDir, colorFilename);

            // Save color using repository (wraps in array as per color-server format)
            colorRepository.saveToFile([colorModel], colorFilePath);

            // Add color file reference to palette
            const colorFileRef: ColorFileReference = {
                'file-path': `${config.colorFilePathPrefix}${colorFilename}`,
                'color-family': colorModel.colorFamily || COLOR_FAMILY.OTHER
            };
            palette.addColorFile(colorFileRef);

            totalColors++;
        }

        // Save palette using repository
        const paletteFilename = `${slugify(paletteName)}-palette.json`;
        const paletteFilePath = path.join(config.paletteOutputDir, paletteFilename);
        paletteRepository.saveToFile(palette, paletteFilePath);

        console.log(`  Created ${coolorsColors.length} color files`);
        console.log(`  Created palette: ${paletteFilename}\n`);

        totalPalettes++;
    }

    console.log(`${'─'.repeat(50)}`);
    console.log(`Conversion complete${headerLabel}!`);
    console.log(`  Total palettes: ${totalPalettes}`);
    console.log(`  Total colors: ${totalColors}`);
    console.log(`  Color files: ${config.colorOutputDir}`);
    console.log(`  Palette files: ${config.paletteOutputDir}`);

    return { palettes: totalPalettes, colors: totalColors };
}

/**
 * Run conversion to both output locations
 */
export async function convertToAllLocations(): Promise<void> {
    console.log('\n' + '█'.repeat(60));
    console.log('  COOLORS PALETTE CONVERTER - DUAL OUTPUT');
    console.log('█'.repeat(60));

    // First: Convert to coolors-palettes-typescript/schemas
    const result1 = await convertPalettes(COOLORS_SCHEMAS_CONFIG, 'Coolors Schemas');

    // Second: Convert to color-server/data
    const result2 = await convertPalettes(COLOR_SERVER_DATA_CONFIG, 'Color Server Data');

    // Summary
    console.log('\n' + '█'.repeat(60));
    console.log('  CONVERSION SUMMARY');
    console.log('█'.repeat(60));
    console.log(`\n  Coolors Schemas:`);
    console.log(`    - ${result1.palettes} palettes, ${result1.colors} colors`);
    console.log(`\n  Color Server Data:`);
    console.log(`    - ${result2.palettes} palettes, ${result2.colors} colors`);
    console.log('\n' + '█'.repeat(60) + '\n');
}

// Run if executed directly
if (require.main === module) {
    convertToAllLocations().catch(console.error);
}
