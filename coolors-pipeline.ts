/**
 * Coolors Pipeline Orchestrator
 *
 * Unified pipeline for processing Coolors palette files:
 * 1. Watches for new TypeScript palette files
 * 2. Generates color schemas and palette schemas
 * 3. Outputs to both coolors-palettes-typescript/schemas and color-server/data
 *
 * Usage:
 *   npx sucrase-node coolors-pipeline.ts --watch          # Daemon mode
 *   npx sucrase-node coolors-pipeline.ts --all            # Process all palettes
 *   npx sucrase-node coolors-pipeline.ts --file <name>    # Process single file
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

// Directory paths
const SCHEMA_DIR = path.join(__dirname, 'json-schema');
const PALETTES_DIR = path.join(__dirname, '..', 'code-files-coolors-co', 'coolors-palettes-typescript');

// Output configurations
const OUTPUT_CONFIGS = {
    coolorsSchemas: {
        colorOutputDir: path.join(PALETTES_DIR, 'schemas', 'color-schemas'),
        paletteOutputDir: path.join(PALETTES_DIR, 'schemas', 'palette-schemas'),
        colorFilePathPrefix: 'color-schemas/'
    },
    colorServerData: {
        colorOutputDir: path.join(__dirname, 'data', 'color-files'),
        paletteOutputDir: path.join(__dirname, 'data', 'palettes'),
        colorFilePathPrefix: 'color-files/'
    }
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
 */
function convertToColorModel(coolorsColor: CoolorsColor, paletteName: string): ColorModel {
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

    return new ColorModel(colorData, SCHEMA_DIR);
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
 * Parse a palette TypeScript file and extract colors
 */
function parsePaletteFile(filename: string): CoolorsColor[] {
    const filePath = path.join(PALETTES_DIR, filename);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return [];
    }

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
 * Ensure all output directories exist
 */
function ensureDirectories(): void {
    for (const config of Object.values(OUTPUT_CONFIGS)) {
        if (!fs.existsSync(config.colorOutputDir)) {
            fs.mkdirSync(config.colorOutputDir, { recursive: true });
        }
        if (!fs.existsSync(config.paletteOutputDir)) {
            fs.mkdirSync(config.paletteOutputDir, { recursive: true });
        }
    }
}

/**
 * Process a single palette file to both output destinations
 */
function processSinglePalette(filename: string): { success: boolean; colors: number } {
    // Ensure .ts extension
    if (!filename.endsWith('.ts')) {
        filename = `${filename}.ts`;
    }

    const paletteName = filenameToPaletteName(filename);
    console.log(`\n[Pipeline] Processing: ${paletteName}`);

    const coolorsColors = parsePaletteFile(filename);
    if (coolorsColors.length === 0) {
        console.log(`  Skipping - no colors found`);
        return { success: false, colors: 0 };
    }

    // Initialize repositories
    const colorRepository = new ColorRepository(SCHEMA_DIR);
    const paletteRepository = new ColorPaletteRepository(SCHEMA_DIR);

    // Process for each output destination
    for (const [destName, config] of Object.entries(OUTPUT_CONFIGS)) {
        // Create palette
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
        const palette = paletteRepository.createPalette(options);

        // Convert and save each color
        for (const coolorsColor of coolorsColors) {
            const colorModel = convertToColorModel(coolorsColor, paletteName);
            const colorFilename = `${slugify(coolorsColor.name)}.json`;
            const colorFilePath = path.join(config.colorOutputDir, colorFilename);

            // Save color
            colorRepository.saveToFile([colorModel], colorFilePath);

            // Add color file reference to palette
            const colorFileRef: ColorFileReference = {
                'file-path': `${config.colorFilePathPrefix}${colorFilename}`,
                'color-family': colorModel.colorFamily || COLOR_FAMILY.OTHER
            };
            palette.addColorFile(colorFileRef);
        }

        // Save palette
        const paletteFilename = `${slugify(paletteName)}-palette.json`;
        const paletteFilePath = path.join(config.paletteOutputDir, paletteFilename);
        paletteRepository.saveToFile(palette, paletteFilePath);

        console.log(`  [${destName}] Created ${coolorsColors.length} colors + palette`);
    }

    return { success: true, colors: coolorsColors.length };
}

/**
 * Get all palette TypeScript files
 */
function getAllPaletteFiles(): string[] {
    const files = fs.readdirSync(PALETTES_DIR);
    return files.filter((file: string) =>
        file.endsWith('.ts') &&
        !file.endsWith('.d.ts')
    );
}

/**
 * Process all existing palette files
 */
function processAll(): void {
    console.log('\n=== Processing All Palettes ===');
    console.log(`Palettes directory: ${PALETTES_DIR}`);

    ensureDirectories();

    const files = getAllPaletteFiles();
    console.log(`Found ${files.length} palette files\n`);

    let totalColors = 0;
    let successCount = 0;

    for (const file of files) {
        const result = processSinglePalette(file);
        if (result.success) {
            successCount++;
            totalColors += result.colors;
        }
    }

    console.log(`\n=== Complete ===`);
    console.log(`Processed: ${successCount}/${files.length} palettes`);
    console.log(`Total colors: ${totalColors}`);
}

/**
 * Watch for new palette files and process them
 */
function watchMode(): void {
    console.log('\n=== Coolors Pipeline Daemon ===');
    console.log(`Watching: ${PALETTES_DIR}`);
    console.log('Press Ctrl+C to stop\n');

    ensureDirectories();

    // Track processed files to avoid duplicates
    const processedFiles = new Set<string>(getAllPaletteFiles());
    console.log(`Existing palettes: ${processedFiles.size}`);

    // Watch for changes
    fs.watch(PALETTES_DIR, (eventType, filename) => {
        if (!filename || !filename.endsWith('.ts') || filename.endsWith('.d.ts')) {
            return;
        }

        // Check if file exists (could be a delete event)
        const filePath = path.join(PALETTES_DIR, filename);
        if (!fs.existsSync(filePath)) {
            return;
        }

        // Process if new or modified
        if (!processedFiles.has(filename)) {
            console.log(`\n[New file detected] ${filename}`);
            processedFiles.add(filename);

            // Small delay to ensure file is fully written
            setTimeout(() => {
                processSinglePalette(filename);
            }, 500);
        }
    });

    // Keep process alive
    process.on('SIGINT', () => {
        console.log('\n\nShutting down pipeline daemon...');
        process.exit(0);
    });
}

/**
 * CLI entry point
 */
function main(): void {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
Coolors Pipeline Orchestrator

Usage:
  npx sucrase-node coolors-pipeline.ts --watch          Start daemon mode
  npx sucrase-node coolors-pipeline.ts --all            Process all palettes
  npx sucrase-node coolors-pipeline.ts --file <name>    Process single palette

Options:
  --watch, -w     Watch for new files and process automatically
  --all, -a       Process all existing palette files
  --file, -f      Process a specific palette file
  --help, -h      Show this help message
`);
        return;
    }

    if (args.includes('--watch') || args.includes('-w')) {
        watchMode();
        return;
    }

    if (args.includes('--all') || args.includes('-a')) {
        processAll();
        return;
    }

    const fileIndex = args.findIndex(arg => arg === '--file' || arg === '-f');
    if (fileIndex !== -1 && args[fileIndex + 1]) {
        ensureDirectories();
        processSinglePalette(args[fileIndex + 1]);
        return;
    }

    // If a bare argument is passed, treat it as a filename
    if (args.length === 1 && !args[0].startsWith('-')) {
        ensureDirectories();
        processSinglePalette(args[0]);
        return;
    }

    console.error('Invalid arguments. Use --help for usage information.');
    process.exit(1);
}

// Export for use as module
export { processSinglePalette, processAll, watchMode };

// Run if executed directly
if (require.main === module) {
    main();
}
