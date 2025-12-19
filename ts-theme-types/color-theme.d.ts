/**
 * Website theme type definitions for color theme configurations.
 * @module color-themes
 */

/**
 * Color value string in hex (#RRGGBB, #RRGGBBAA), rgb(), rgba(), hsl(), or hsla() format.
 */
export type ColorValue = string;

/**
 * Brand color with main, light, dark, and contrast variants.
 */
export interface BrandColor {
    /** Description of the color's purpose */
    description?: string;
    /** Main color value */
    main: ColorValue;
    /** Lighter variant */
    light?: ColorValue;
    /** Darker variant */
    dark?: ColorValue;
    /** Contrast color for text overlay */
    contrast?: ColorValue;
}

/**
 * Background colors for page and container backgrounds.
 */
export interface BackgroundColors {
    /** Description of background color usage */
    description?: string;
    /** Default page background */
    default: ColorValue;
    /** Paper/card background */
    paper?: ColorValue;
    /** Elevated surface background */
    elevated?: ColorValue;
}

/**
 * Surface colors for component surfaces like cards, modals, and panels.
 */
export interface SurfaceColors {
    /** Description of surface color usage */
    description?: string;
    /** Default surface color */
    default?: ColorValue;
    /** Variant surface color */
    variant?: ColorValue;
    /** Inverse surface color */
    inverse?: ColorValue;
}

/**
 * Text colors for typography.
 */
export interface TextColors {
    /** Description of text color usage */
    description?: string;
    /** Primary text color */
    primary: ColorValue;
    /** Secondary/muted text color */
    secondary?: ColorValue;
    /** Disabled text color */
    disabled?: ColorValue;
    /** Hint/placeholder text color */
    hint?: ColorValue;
    /** Inverse text color for dark backgrounds */
    inverse?: ColorValue;
}

/**
 * Border colors for inputs, cards, dividers, and separators.
 */
export interface BorderColors {
    /** Description of border color usage */
    description?: string;
    /** Default border color */
    default?: ColorValue;
    /** Light border color */
    light?: ColorValue;
    /** Focus state border color */
    focus?: ColorValue;
}

/**
 * Status colors for alerts, toasts, form validation, and status indicators.
 */
export interface StatusColors {
    /** Description of status color usage */
    description?: string;
    /** Success state color */
    success?: ColorValue;
    /** Success light variant */
    "success-light"?: ColorValue;
    /** Warning state color */
    warning?: ColorValue;
    /** Warning light variant */
    "warning-light"?: ColorValue;
    /** Error state color */
    error?: ColorValue;
    /** Error light variant */
    "error-light"?: ColorValue;
    /** Info state color */
    info?: ColorValue;
    /** Info light variant */
    "info-light"?: ColorValue;
}

/**
 * Interaction colors for interactive element states.
 */
export interface InteractionColors {
    /** Description of interaction color usage */
    description?: string;
    /** Hover state color */
    hover?: ColorValue;
    /** Active/pressed state color */
    active?: ColorValue;
    /** Selected state color */
    selected?: ColorValue;
    /** Disabled state color */
    disabled?: ColorValue;
    /** Focus ring color */
    "focus-ring"?: ColorValue;
}

/**
 * Link colors for anchor and navigation links.
 */
export interface LinkColors {
    /** Description of link color usage */
    description?: string;
    /** Default link color */
    default?: ColorValue;
    /** Visited link color */
    visited?: ColorValue;
    /** Hover state link color */
    hover?: ColorValue;
    /** Active state link color */
    active?: ColorValue;
}

/**
 * Shadow colors for box shadows and depth effects.
 */
export interface ShadowColors {
    /** Description of shadow color usage */
    description?: string;
    /** Light shadow */
    light?: ColorValue;
    /** Medium shadow */
    medium?: ColorValue;
    /** Dark shadow */
    dark?: ColorValue;
}

/**
 * Overlay colors for modals, drawers, and backdrop layers.
 */
export interface OverlayColors {
    /** Description of overlay color usage */
    description?: string;
    /** Light overlay */
    light?: ColorValue;
    /** Medium overlay */
    medium?: ColorValue;
    /** Dark overlay */
    dark?: ColorValue;
}

/**
 * Complete theme colors collection organized by semantic purpose.
 */
export interface ThemeColors {
    /** Main brand color */
    primary: BrandColor;
    /** Supporting brand color */
    secondary?: BrandColor;
    /** Highlight/accent color */
    accent?: BrandColor;
    /** Page and container backgrounds */
    background: BackgroundColors;
    /** Component surface colors */
    surface?: SurfaceColors;
    /** Typography colors */
    text: TextColors;
    /** Border colors */
    border?: BorderColors;
    /** Semantic status colors */
    status?: StatusColors;
    /** Interactive element state colors */
    interaction?: InteractionColors;
    /** Link colors */
    link?: LinkColors;
    /** Shadow colors */
    shadow?: ShadowColors;
    /** Overlay colors */
    overlay?: OverlayColors;
}

/**
 * Complete website theme definition.
 */
export interface WebsiteTheme {
    /** Name identifier for the theme */
    "theme-name": string;
    /** Brief description of the theme's style and purpose */
    "theme-description"?: string;
    /** Color definitions organized by semantic purpose */
    colors: ThemeColors;
}
