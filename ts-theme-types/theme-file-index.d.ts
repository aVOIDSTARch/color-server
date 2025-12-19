/**
 * Theme format type definitions index.
 * Re-exports all theme export format types.
 * @module theme-formats
 */

// Import types for use in union type
import type { ReactThemeFormat } from "./theme-formats/react-theme-format";
import type { VueThemeFormat } from "./theme-formats/vue-theme-format";
import type { AngularThemeFormat } from "./theme-formats/angular-theme-format";
import type { SvelteThemeFormat } from "./theme-formats/svelte-theme-format";
import type { SolidThemeFormat } from "./theme-formats/solid-theme-format";
import type { CssThemeFormat } from "./theme-formats/css-theme-format";
import type { ScssThemeFormat } from "./theme-formats/scss-theme-format";
import type { LessThemeFormat } from "./theme-formats/less-theme-format";
import type { StyledComponentsThemeFormat } from "./theme-formats/styled-components-theme-format";
import type { EmotionThemeFormat } from "./theme-formats/emotion-theme-format";
import type { VanillaThemeFormat } from "./theme-formats/vanilla-theme-format";
import type { TailwindThemeFormat } from "./theme-formats/tailwind-theme-format";
import type { DaisyuiThemeFormat } from "./theme-formats/daisyui-theme-format";
import type { JsonThemeFormat } from "./theme-formats/json-theme-format";
import type { XmlThemeFormat } from "./theme-formats/xml-theme-format";

// Re-export base format
export type { ExportThemeFormat, ThemeExportFormatType } from "./export-theme-format";

// Re-export framework formats
export type { ReactThemeFormat } from "./theme-formats/react-theme-format";
export type { VueThemeFormat } from "./theme-formats/vue-theme-format";
export type { AngularThemeFormat } from "./theme-formats/angular-theme-format";
export type { SvelteThemeFormat } from "./theme-formats/svelte-theme-format";
export type { SolidThemeFormat } from "./theme-formats/solid-theme-format";

// Re-export CSS preprocessor formats
export type { CssThemeFormat } from "./theme-formats/css-theme-format";
export type { ScssThemeFormat } from "./theme-formats/scss-theme-format";
export type { LessThemeFormat } from "./theme-formats/less-theme-format";

// Re-export CSS-in-JS formats
export type { StyledComponentsThemeFormat } from "./theme-formats/styled-components-theme-format";
export type { EmotionThemeFormat } from "./theme-formats/emotion-theme-format";
export type { VanillaThemeFormat } from "./theme-formats/vanilla-theme-format";
export type { TailwindThemeFormat } from "./theme-formats/tailwind-theme-format";
export type { DaisyuiThemeFormat } from "./theme-formats/daisyui-theme-format";

// Re-export data formats
export type { JsonThemeFormat } from "./theme-formats/json-theme-format";
export type { XmlThemeFormat } from "./theme-formats/xml-theme-format";

/**
 * Union type of all theme export formats.
 */
export type AnyThemeFormat =
    | ReactThemeFormat
    | VueThemeFormat
    | AngularThemeFormat
    | SvelteThemeFormat
    | SolidThemeFormat
    | CssThemeFormat
    | ScssThemeFormat
    | LessThemeFormat
    | StyledComponentsThemeFormat
    | EmotionThemeFormat
    | VanillaThemeFormat
    | TailwindThemeFormat
    | DaisyuiThemeFormat
    | JsonThemeFormat
    | XmlThemeFormat;
