// Application to generate themes based on color files, color theme collections and output in a variety of formats for different platforms

import fs from "fs";
import path from "path";
import { Color } from './color-api';

interface ThemeFile {
    themeName: string;
    filename: string;
    filepath: string;
}

export enum ThemeExportFormat {
    REACT = "react",
    CSS = "css",
    SCSS = "scss",
    LESS = "less",
    VUE = "vue",
    ANGULAR = "angular",
    SVELTE = "svelte",
    SOLID = "solid",
    STYLED_COMPONENTS = "styled-components",
    TAILWIND = "tailwind",
    DAISYUI = "daisyui",
    EMOTION = "emotion",
    VANILLA = "vanilla",
    JSON = "json",
    XML = "xml"
}
