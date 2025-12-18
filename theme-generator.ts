// Application to generate themes based on color files, color theme collections and output in a variety of formats for different platforms

import fs from "fs";
import path from "path";

interface ThemeFile {
    themeName: string;
    colors: { [key: string]: string };
}
