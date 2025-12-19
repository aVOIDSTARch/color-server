/**
 * Theme format type definitions index.
 * Re-exports all theme export format types.
 * @module theme-formats
 */

// Import types for use in union type
import type { ReactThemeFormat, ReactThemeImplementation } from "./theme-formats/react-theme-format";
import type { VueThemeFormat, VueThemeImplementation } from "./theme-formats/vue-theme-format";
import type { AngularThemeFormat, AngularThemeImplementation } from "./theme-formats/angular-theme-format";
import type { SvelteThemeFormat, SvelteThemeImplementation } from "./theme-formats/svelte-theme-format";
import type { SolidThemeFormat, SolidThemeImplementation } from "./theme-formats/solid-theme-format";
import type { CssThemeFormat, CssThemeImplementation } from "./theme-formats/css-theme-format";
import type { ScssThemeFormat, ScssThemeImplementation } from "./theme-formats/scss-theme-format";
import type { LessThemeFormat, LessThemeImplementation } from "./theme-formats/less-theme-format";
import type { StyledComponentsThemeFormat, StyledComponentsThemeImplementation } from "./theme-formats/styled-components-theme-format";
import type { EmotionThemeFormat, EmotionThemeImplementation } from "./theme-formats/emotion-theme-format";
import type { VanillaThemeFormat, VanillaThemeImplementation } from "./theme-formats/vanilla-theme-format";
import type { TailwindThemeFormat, TailwindThemeImplementation } from "./theme-formats/tailwind-theme-format";
import type { DaisyuiThemeFormat, DaisyuiThemeImplementation } from "./theme-formats/daisyui-theme-format";
import type { JsonThemeFormat, JsonThemeImplementation } from "./theme-formats/json-theme-format";
import type { XmlThemeFormat, XmlThemeImplementation } from "./theme-formats/xml-theme-format";

// Re-export base format
export type { ExportThemeFormat, ThemeExportFormatType } from "./export-theme-format";

// Re-export framework formats
export type { ReactThemeFormat, ReactThemeImplementation } from "./theme-formats/react-theme-format";
export type { VueThemeFormat, VueThemeImplementation } from "./theme-formats/vue-theme-format";
export type { AngularThemeFormat, AngularThemeImplementation } from "./theme-formats/angular-theme-format";
export type { SvelteThemeFormat, SvelteThemeImplementation } from "./theme-formats/svelte-theme-format";
export type { SolidThemeFormat, SolidThemeImplementation } from "./theme-formats/solid-theme-format";

// Re-export CSS preprocessor formats
export type { CssThemeFormat, CssThemeImplementation } from "./theme-formats/css-theme-format";
export type { ScssThemeFormat, ScssThemeImplementation } from "./theme-formats/scss-theme-format";
export type { LessThemeFormat, LessThemeImplementation } from "./theme-formats/less-theme-format";

// Re-export CSS-in-JS formats
export type { StyledComponentsThemeFormat , StyledComponentsThemeImplementation} from "./theme-formats/styled-components-theme-format";
export type { EmotionThemeFormat, EmotionThemeImplementation } from "./theme-formats/emotion-theme-format";
export type { VanillaThemeFormat, VanillaThemeImplementation } from "./theme-formats/vanilla-theme-format";
export type { TailwindThemeFormat, TailwindThemeImplementation } from "./theme-formats/tailwind-theme-format";
export type { DaisyuiThemeFormat, DaisyuiThemeImplementation } from "./theme-formats/daisyui-theme-format";

// Re-export data formats
export type { JsonThemeFormat, JsonThemeImplementation } from "./theme-formats/json-theme-format";
export type { XmlThemeFormat , XmlThemeImplementation} from "./theme-formats/xml-theme-format";

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
