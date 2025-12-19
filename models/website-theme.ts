/**
 * Website Theme Model
 * Implements the website theme schema with full CRUD operations.
 * Provides utilities for creating, managing, and exporting color themes.
 */

import { JsonMaker } from "../json-maker";
import { ColorModel } from "./color";
import { colorCodeParser, colorCodeConverter, colorCodeFormatter } from "./color-code-format";

// Schema path
const THEME_SCHEMA = "website-theme-schema.json";

/**
 * Color role variant interface
 */
export interface ColorVariants {
    description?: string;
    main?: string;
    light?: string;
    dark?: string;
    contrast?: string;
}

/**
 * Background colors interface
 */
export interface BackgroundColors {
    description?: string;
    default: string;
    paper?: string;
    elevated?: string;
}

/**
 * Surface colors interface
 */
export interface SurfaceColors {
    description?: string;
    default?: string;
    variant?: string;
    inverse?: string;
}

/**
 * Text colors interface
 */
export interface TextColors {
    description?: string;
    primary: string;
    secondary?: string;
    disabled?: string;
    hint?: string;
    inverse?: string;
}

/**
 * Border colors interface
 */
export interface BorderColors {
    description?: string;
    default?: string;
    light?: string;
    focus?: string;
}

/**
 * Status colors interface
 */
export interface StatusColors {
    description?: string;
    success?: string;
    "success-light"?: string;
    warning?: string;
    "warning-light"?: string;
    error?: string;
    "error-light"?: string;
    info?: string;
    "info-light"?: string;
}

/**
 * Interaction colors interface
 */
export interface InteractionColors {
    description?: string;
    hover?: string;
    active?: string;
    selected?: string;
    disabled?: string;
    "focus-ring"?: string;
}

/**
 * Link colors interface
 */
export interface LinkColors {
    description?: string;
    default?: string;
    visited?: string;
    hover?: string;
    active?: string;
}

/**
 * Shadow colors interface
 */
export interface ShadowColors {
    description?: string;
    light?: string;
    medium?: string;
    dark?: string;
}

/**
 * Overlay colors interface
 */
export interface OverlayColors {
    description?: string;
    light?: string;
    medium?: string;
    dark?: string;
}

/**
 * Theme colors collection interface
 */
export interface ThemeColors {
    primary: ColorVariants & { main: string };
    secondary?: ColorVariants;
    accent?: ColorVariants;
    background: BackgroundColors;
    surface?: SurfaceColors;
    text: TextColors;
    border?: BorderColors;
    status?: StatusColors;
    interaction?: InteractionColors;
    link?: LinkColors;
    shadow?: ShadowColors;
    overlay?: OverlayColors;
}

/**
 * Website theme data interface
 */
export interface WebsiteThemeData {
    "theme-name": string;
    "theme-description"?: string;
    colors: ThemeColors;
}

/**
 * WebsiteThemeModel class for working with website theme data
 */
export class WebsiteThemeModel {
    private jsonMaker: JsonMaker;
    private data: WebsiteThemeData;

    constructor(data: WebsiteThemeData, schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
        this.data = data;
    }

    // Getters
    get themeName(): string {
        return this.data["theme-name"];
    }

    get themeDescription(): string | undefined {
        return this.data["theme-description"];
    }

    get colors(): ThemeColors {
        return this.data.colors;
    }

    // Setters
    set themeName(value: string) {
        this.data["theme-name"] = value;
    }

    set themeDescription(value: string | undefined) {
        this.data["theme-description"] = value;
    }

    // Get raw data
    toJSON(): WebsiteThemeData {
        return JSON.parse(JSON.stringify(this.data));
    }

    // Get primary color
    getPrimaryColor(): string {
        return this.data.colors.primary.main;
    }

    // Set primary color with variants
    setPrimaryColor(main: string, light?: string, dark?: string, contrast?: string): void {
        this.data.colors.primary = {
            ...this.data.colors.primary,
            main,
            light,
            dark,
            contrast
        };
    }

    // Get secondary color
    getSecondaryColor(): string | undefined {
        return this.data.colors.secondary?.main;
    }

    // Set secondary color with variants
    setSecondaryColor(main: string, light?: string, dark?: string, contrast?: string): void {
        this.data.colors.secondary = {
            main,
            light,
            dark,
            contrast
        };
    }

    // Get accent color
    getAccentColor(): string | undefined {
        return this.data.colors.accent?.main;
    }

    // Set accent color with variants
    setAccentColor(main: string, light?: string, dark?: string, contrast?: string): void {
        this.data.colors.accent = {
            main,
            light,
            dark,
            contrast
        };
    }

    // Get background colors
    getBackgroundColors(): BackgroundColors {
        return this.data.colors.background;
    }

    // Set background colors
    setBackgroundColors(colors: BackgroundColors): void {
        this.data.colors.background = colors;
    }

    // Get text colors
    getTextColors(): TextColors {
        return this.data.colors.text;
    }

    // Set text colors
    setTextColors(colors: TextColors): void {
        this.data.colors.text = colors;
    }

    // Get status colors
    getStatusColors(): StatusColors | undefined {
        return this.data.colors.status;
    }

    // Set status colors
    setStatusColors(colors: StatusColors): void {
        this.data.colors.status = colors;
    }

    // Get all color values as flat array
    getAllColorValues(): string[] {
        const colors: string[] = [];

        const extractColors = (obj: Record<string, unknown>): void => {
            for (const value of Object.values(obj)) {
                if (typeof value === "string" && this.isColorValue(value)) {
                    colors.push(value);
                } else if (typeof value === "object" && value !== null) {
                    extractColors(value as Record<string, unknown>);
                }
            }
        };

        extractColors(this.data.colors as unknown as Record<string, unknown>);
        return colors;
    }

    // Get unique color values
    getUniqueColors(): string[] {
        return [...new Set(this.getAllColorValues())];
    }

    // Count total colors
    getColorCount(): number {
        return this.getAllColorValues().length;
    }

    // Check if a string is a color value
    private isColorValue(value: string): boolean {
        return colorCodeParser.detectFormat(value) !== null;
    }

    // Generate CSS custom properties
    toCssVariables(prefix: string = "--theme"): string {
        const lines: string[] = [];

        const processObject = (obj: Record<string, unknown>, path: string): void => {
            for (const [key, value] of Object.entries(obj)) {
                if (key === "description") continue;

                const varName = `${path}-${key}`.replace(/([A-Z])/g, "-$1").toLowerCase();

                if (typeof value === "string" && this.isColorValue(value)) {
                    lines.push(`${varName}: ${value};`);
                } else if (typeof value === "object" && value !== null) {
                    processObject(value as Record<string, unknown>, varName);
                }
            }
        };

        processObject(this.data.colors as unknown as Record<string, unknown>, prefix);
        return lines.join("\n");
    }

    // Generate SCSS variables
    toScssVariables(prefix: string = "$theme"): string {
        const lines: string[] = [];

        const processObject = (obj: Record<string, unknown>, path: string): void => {
            for (const [key, value] of Object.entries(obj)) {
                if (key === "description") continue;

                const varName = `${path}-${key}`.replace(/([A-Z])/g, "-$1").toLowerCase();

                if (typeof value === "string" && this.isColorValue(value)) {
                    lines.push(`${varName}: ${value};`);
                } else if (typeof value === "object" && value !== null) {
                    processObject(value as Record<string, unknown>, varName);
                }
            }
        };

        processObject(this.data.colors as unknown as Record<string, unknown>, prefix);
        return lines.join("\n");
    }

    // Generate JavaScript/TypeScript object
    toJsObject(): Record<string, Record<string, string>> {
        const result: Record<string, Record<string, string>> = {};

        for (const [category, colors] of Object.entries(this.data.colors)) {
            if (typeof colors === "object" && colors !== null) {
                result[category] = {};
                for (const [key, value] of Object.entries(colors)) {
                    if (typeof value === "string" && this.isColorValue(value)) {
                        result[category][key] = value;
                    }
                }
            }
        }

        return result;
    }

    // Validate against schema
    validate(): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validate(this.data, THEME_SCHEMA);
    }
}

/**
 * WebsiteThemeRepository for managing website theme files
 */
export class WebsiteThemeRepository {
    private jsonMaker: JsonMaker;

    constructor(schemaDir: string = "./json-schema") {
        this.jsonMaker = new JsonMaker(schemaDir);
    }

    // Load theme from a file
    loadFromFile(filePath: string): WebsiteThemeModel {
        const validation = this.jsonMaker.validateFile(filePath, THEME_SCHEMA);
        if (!validation.valid) {
            throw new Error(
                `Invalid theme file: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        const data = this.jsonMaker.readData({
            type: "file",
            path: filePath
        }) as WebsiteThemeData;
        return new WebsiteThemeModel(data);
    }

    // Save theme to a file
    saveToFile(theme: WebsiteThemeModel, filePath: string): void {
        const data = theme.toJSON();
        const validation = this.jsonMaker.validate(data, THEME_SCHEMA);

        if (!validation.valid) {
            throw new Error(
                `Invalid theme data: ${validation.errors.map((e) => e.message).join(", ")}`
            );
        }

        this.jsonMaker.writeJson(data, filePath);
    }

    // Create a new theme
    createTheme(
        name: string,
        primaryColor: string,
        backgroundColor: string,
        textColor: string,
        description?: string
    ): WebsiteThemeModel {
        // Generate light and dark variants
        const primaryVariants = this.generateColorVariants(primaryColor);

        const themeData: WebsiteThemeData = {
            "theme-name": name,
            colors: {
                primary: {
                    main: primaryColor,
                    ...primaryVariants
                },
                background: {
                    default: backgroundColor
                },
                text: {
                    primary: textColor
                }
            }
        };

        if (description) {
            themeData["theme-description"] = description;
        }

        return new WebsiteThemeModel(themeData);
    }

    // Generate color variants (light, dark, contrast)
    generateColorVariants(
        colorValue: string
    ): { light?: string; dark?: string; contrast?: string } {
        const parsed = colorCodeParser.parseAuto(colorValue);
        if (!parsed) return {};

        let hsl;
        if (parsed.hex) {
            const rgb = colorCodeConverter.hexToRgb(parsed.hex);
            hsl = colorCodeConverter.rgbToHsl(rgb);
        } else if (parsed.rgb) {
            hsl = colorCodeConverter.rgbToHsl(parsed.rgb);
        } else if (parsed.hsl) {
            hsl = parsed.hsl;
        } else {
            return {};
        }

        // Generate light variant (increase lightness)
        const lightHsl = { ...hsl, l: Math.min(100, hsl.l + 15) };
        const lightRgb = colorCodeConverter.hslToRgb(lightHsl);
        const lightHex = colorCodeConverter.rgbToHex(lightRgb);

        // Generate dark variant (decrease lightness)
        const darkHsl = { ...hsl, l: Math.max(0, hsl.l - 15) };
        const darkRgb = colorCodeConverter.hslToRgb(darkHsl);
        const darkHex = colorCodeConverter.rgbToHex(darkRgb);

        // Generate contrast color (black or white based on lightness)
        const contrast = hsl.l > 50 ? "#000000" : "#FFFFFF";

        return {
            light: colorCodeFormatter.formatHex(lightHex),
            dark: colorCodeFormatter.formatHex(darkHex),
            contrast
        };
    }

    // Create theme from ColorModel colors
    createThemeFromColors(
        name: string,
        primaryColor: ColorModel,
        backgroundColor: ColorModel,
        textColor: ColorModel,
        options?: {
            secondaryColor?: ColorModel;
            accentColor?: ColorModel;
            description?: string;
        }
    ): WebsiteThemeModel {
        const primaryHex = primaryColor.getHexString();
        const bgHex = backgroundColor.getHexString();
        const textHex = textColor.getHexString();

        const theme = this.createTheme(
            name,
            primaryHex,
            bgHex,
            textHex,
            options?.description
        );

        if (options?.secondaryColor) {
            const secondaryHex = options.secondaryColor.getHexString();
            const secondaryVariants = this.generateColorVariants(secondaryHex);
            theme.setSecondaryColor(
                secondaryHex,
                secondaryVariants.light,
                secondaryVariants.dark,
                secondaryVariants.contrast
            );
        }

        if (options?.accentColor) {
            const accentHex = options.accentColor.getHexString();
            const accentVariants = this.generateColorVariants(accentHex);
            theme.setAccentColor(
                accentHex,
                accentVariants.light,
                accentVariants.dark,
                accentVariants.contrast
            );
        }

        return theme;
    }

    // Clone a theme with a new name
    cloneTheme(source: WebsiteThemeModel, newName: string): WebsiteThemeModel {
        const clonedData = source.toJSON();
        clonedData["theme-name"] = newName;
        return new WebsiteThemeModel(clonedData);
    }

    // Create dark mode variant of a theme
    createDarkVariant(source: WebsiteThemeModel): WebsiteThemeModel {
        const clonedData = source.toJSON();
        clonedData["theme-name"] = `${source.themeName} Dark`;

        // Invert background and text colors
        const bgColors = clonedData.colors.background;
        const textColors = clonedData.colors.text;

        // Swap or darken background
        if (bgColors.default) {
            const parsed = colorCodeParser.parseAuto(bgColors.default);
            if (parsed?.hex) {
                const rgb = colorCodeConverter.hexToRgb(parsed.hex);
                const hsl = colorCodeConverter.rgbToHsl(rgb);
                // Invert lightness
                hsl.l = 100 - hsl.l;
                if (hsl.l > 30) hsl.l = 15; // Ensure it's dark
                const darkRgb = colorCodeConverter.hslToRgb(hsl);
                const darkHex = colorCodeConverter.rgbToHex(darkRgb);
                bgColors.default = colorCodeFormatter.formatHex(darkHex);
            }
        }

        // Lighten text for dark background
        if (textColors.primary) {
            const parsed = colorCodeParser.parseAuto(textColors.primary);
            if (parsed?.hex) {
                const rgb = colorCodeConverter.hexToRgb(parsed.hex);
                const hsl = colorCodeConverter.rgbToHsl(rgb);
                // Invert lightness
                hsl.l = 100 - hsl.l;
                if (hsl.l < 70) hsl.l = 90; // Ensure it's light
                const lightRgb = colorCodeConverter.hslToRgb(hsl);
                const lightHex = colorCodeConverter.rgbToHex(lightRgb);
                textColors.primary = colorCodeFormatter.formatHex(lightHex);
            }
        }

        return new WebsiteThemeModel(clonedData);
    }

    // Export theme to CSS file content
    exportToCss(theme: WebsiteThemeModel, selector: string = ":root"): string {
        const variables = theme.toCssVariables();
        return `${selector} {\n${variables
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")}\n}`;
    }

    // Export theme to SCSS file content
    exportToScss(theme: WebsiteThemeModel): string {
        return theme.toScssVariables();
    }

    // Export theme to JSON
    exportToJson(theme: WebsiteThemeModel): string {
        return JSON.stringify(theme.toJSON(), null, 2);
    }

    // Export theme to JavaScript module
    exportToJsModule(theme: WebsiteThemeModel, exportName: string = "theme"): string {
        const obj = theme.toJsObject();
        return `export const ${exportName} = ${JSON.stringify(obj, null, 2)};`;
    }

    // Export theme to TypeScript module with types
    exportToTsModule(theme: WebsiteThemeModel, exportName: string = "theme"): string {
        const obj = theme.toJsObject();
        const typeLines: string[] = [];

        typeLines.push(`export interface ${exportName.charAt(0).toUpperCase() + exportName.slice(1)}Colors {`);
        for (const [category, colors] of Object.entries(obj)) {
            typeLines.push(`  ${category}: {`);
            for (const key of Object.keys(colors)) {
                typeLines.push(`    ${key}: string;`);
            }
            typeLines.push(`  };`);
        }
        typeLines.push(`}`);
        typeLines.push(``);
        typeLines.push(
            `export const ${exportName}: ${exportName.charAt(0).toUpperCase() + exportName.slice(1)}Colors = ${JSON.stringify(obj, null, 2)};`
        );

        return typeLines.join("\n");
    }

    // Validate a theme file
    validateFile(
        filePath: string
    ): { valid: boolean; errors: Array<{ path: string; message: string }> } {
        return this.jsonMaker.validateFile(filePath, THEME_SCHEMA);
    }
}

// Export default repository instance
export const websiteThemeRepository = new WebsiteThemeRepository();
