# Color Server

A TypeScript application for managing color codes, color palettes, and building theme files. Includes utilities for JSON schema validation, color manipulation, and converting colors from external sources like Coolors.co.

## Features

- **Color Management**: Full CRUD operations for colors with multiple color code formats (HEX, RGB, HSL, CMYK)
- **Palette Management**: Create, edit, and organize color palettes
- **JSON Schema Validation**: Validate data against JSON Schema draft-07
- **Color Manipulation**: Lighten, darken, saturate, get complementary colors, and more
- **Coolors Integration**: Convert palettes from Coolors.co to color-server format
- **Theme Generation**: Build website themes from color palettes

## Installation

```bash
npm install
```

## Project Structure

```
color-server/
├── models/                    # TypeScript model classes
│   ├── color.ts              # ColorModel & ColorRepository
│   ├── color-palette.ts      # ColorPaletteModel & ColorPaletteRepository
│   ├── color-collection.ts   # ColorCollectionModel
│   ├── color-family.ts       # Color family utilities
│   ├── color-code-format.ts  # Color format handling
│   └── website-theme.ts      # Theme generation
├── ts-color-types/           # TypeScript type definitions
│   ├── color-enums.ts        # COLOR_FAMILY, COLOR_CODE_SYSTEM_NAME enums
│   └── *.d.ts                # Type declaration files
├── json-schema/              # JSON Schema definitions
│   ├── color-file-schema.json
│   ├── color-palette-schema.json
│   └── ...
├── data/                     # Color data files
│   ├── color-files/          # Individual color JSON files (2000+)
│   └── palettes/             # Palette JSON files
├── json-maker.ts             # JSON utility class
├── convert-coolors-palettes.ts  # Coolors converter
└── theme-generator.ts        # Theme generation utilities
```

## Quick Start

### Working with Colors

```typescript
import { ColorModel, ColorRepository } from './models/color';

// Create a repository
const colorRepo = new ColorRepository('./json-schema');

// Create a color from hex
const color = colorRepo.createFromHex('#FF5733', 'Sunset Orange');

// Access color properties
console.log(color.name);                    // "Sunset Orange"
console.log(color.getHexString());          // "#FF5733"
console.log(color.getRgbString());          // "rgb(255, 87, 51)"
console.log(color.getHslString());          // "hsl(11, 100%, 60%)"

// Color manipulation
const lighter = color.lighten(20);          // Lighten by 20%
const complementary = color.getComplementary();

// Save colors
colorRepo.saveToFile([color], './output/sunset-orange.json');
```

### Working with Palettes

```typescript
import { ColorPaletteRepository } from './models/color-palette';

const paletteRepo = new ColorPaletteRepository('./json-schema');

// Create a new palette
const palette = paletteRepo.createPalette({
    paletteName: 'My Palette',
    version: '1.0.0',
    author: 'Your Name',
    collectionFileName: 'my-palette-colors.json',
    collectionDescription: 'A custom color palette'
});

// Add colors to the palette
palette.addColorFile({
    'file-path': 'color-files/sunset-orange.json',
    'color-family': 'Orange Shades'
});

// Save the palette
paletteRepo.saveToFile(palette, './output/my-palette.json');
```

### Converting Coolors Palettes

```bash
# Convert all palettes to both locations
npm run convert

# Convert only to Coolors schemas folder
npm run convert:coolors

# Convert only to Color Server data folder
npm run convert:server
```

Or programmatically:

```typescript
import { convertPalettes, COOLORS_SCHEMAS_CONFIG, COLOR_SERVER_DATA_CONFIG } from './convert-coolors-palettes';

// Convert to specific location
await convertPalettes(COOLORS_SCHEMAS_CONFIG, 'Coolors Schemas');

// Or use custom config
await convertPalettes({
    palettesDir: './my-palettes',
    colorOutputDir: './output/colors',
    paletteOutputDir: './output/palettes',
    schemaDir: './json-schema',
    colorFilePathPrefix: 'colors/'
}, 'Custom Output');
```

---

## JSON Maker

A TypeScript utility for working with JSON schemas, validating data, and creating JSON files.

### Basic Validation

```typescript
import { jsonMaker } from './json-maker';

// Validate data against a schema
const result = jsonMaker.validate(myData, 'color-file-schema.json');

if (result.valid) {
    console.log('Data is valid!');
} else {
    console.log('Validation errors:', result.errors);
}

// Validate a JSON file
const fileResult = jsonMaker.validateFile('./data/colors/red.json', 'color-file-schema.json');
```

### Reading and Writing JSON

```typescript
import { readJson, writeJson } from './json-maker';

// Read a JSON file
const colors = readJson<ColorData[]>('./data/colors.json');

// Write data to a JSON file
writeJson(myData, './output/result.json', {
    prettyPrint: true,
    indentSize: 4
});

// Write with schema reference
writeJson(myData, './output/result.json', {
    includeSchema: true,
    schemaUrl: './json-schema/color-file-schema.json'
});
```

### Create Validated JSON

```typescript
// Only writes the file if validation passes
const result = jsonMaker.createValidatedJson(
    colorData,
    'color-file-schema.json',
    './output/new-color.json'
);

if (!result.valid) {
    console.log('Failed to create file:', result.errors);
}
```

### Schema Information

```typescript
import { getSchemaInfo } from './json-maker';

const info = getSchemaInfo('color-palette-schema.json');
console.log(info);
// {
//   title: "Color Palette Schema",
//   description: "Schema for color palette definition files",
//   rootType: "object",
//   requiredFields: ["palette-name", "version", "author", "date-created", "collection"],
//   properties: ["palette-name", "project-name", "version", ...]
// }
```

### Generate Templates

```typescript
// Generate an empty object matching the schema structure
const template = jsonMaker.generateTemplate('color-file-schema.json');
```

### Data Transformation

```typescript
// Extract specific fields
const names = jsonMaker.extractFields(colorData, ['name', 'color-family']);

// Transform data
const transformed = jsonMaker.transformData(colors, (color, index) => ({
    id: index,
    displayName: color.name.toUpperCase(),
    hex: color['color-codes'].hex
}));

// Filter data
const redColors = jsonMaker.filterData(colors,
    color => color['color-family'] === 'Red Shades'
);
```

### Merge and Split Files

```typescript
// Merge multiple JSON files into one
jsonMaker.mergeJsonFiles(
    ['./colors/red.json', './colors/blue.json', './colors/green.json'],
    './output/all-colors.json'
);

// Split a JSON array into multiple files by a field
const createdFiles = jsonMaker.splitJsonFile(
    './data/all-colors.json',
    './output/by-family/',
    'color-family',
    (family) => `${family.toLowerCase().replace(' ', '-')}.json`
);
```

---

## Color Models

### ColorModel

Represents a single color with all its properties and manipulation methods.

```typescript
import { ColorModel, ColorData } from './models/color';

const color = new ColorModel(colorData, './json-schema');

// Properties
color.id                  // Unique color ID
color.name                // Color name
color.colorFamily         // COLOR_FAMILY enum value
color.colorCodes          // All color code formats
color.description         // Color description

// String representations
color.getHexString()      // "#FF5733"
color.getHexWithAlpha()   // "#FF5733FF"
color.getRgbString()      // "rgb(255, 87, 51)"
color.getRgbaString(0.5)  // "rgba(255, 87, 51, 0.5)"
color.getHslString()      // "hsl(11, 100%, 60%)"
color.getCmykString()     // "cmyk(0%, 66%, 80%, 0%)"

// Color manipulation (returns HSL values)
color.lighten(20)         // Lighten by amount
color.darken(20)          // Darken by amount
color.saturate(20)        // Increase saturation
color.desaturate(20)      // Decrease saturation
color.getComplementary()  // Get complementary color
color.getTriadic()        // Get triadic colors [HSL, HSL]
color.getAnalogous(30)    // Get analogous colors [HSL, HSL]

// Utility methods
color.isLight()           // true if lightness > 50%
color.isDark()            // true if lightness <= 50%
color.getContrastColor()  // "#000000" or "#FFFFFF"

// Validation
color.validate()          // { valid: boolean, errors: [] }

// Export
color.toJSON()            // Get raw ColorData object
```

### ColorRepository

Manages loading, saving, and searching colors.

```typescript
import { ColorRepository } from './models/color';

const repo = new ColorRepository('./json-schema');

// Create from hex
const color = repo.createFromHex('#FF5733', 'Sunset Orange');

// File operations
repo.saveToFile([color1, color2], './colors.json');
const colors = repo.loadFromFile('./colors.json');

// Search
repo.findById(colors, 'ABC123');
repo.findByName(colors, 'sunset');       // Partial match
repo.findByFamily(colors, COLOR_FAMILY.ORANGE);
repo.findByHex(colors, '#FF5733');
```

### ColorPaletteModel

Represents a color palette with metadata and color file references.

```typescript
import { ColorPaletteModel } from './models/color-palette';

// Properties
palette.paletteName       // Palette name
palette.version           // Semantic version
palette.author            // Author name
palette.dateCreated       // Creation date
palette.collection        // PaletteCollection object

// Color file management
palette.addColorFile(reference);
palette.removeColorFile('path/to/color.json');
palette.getColorFiles();
palette.getColorFilesByFamily(COLOR_FAMILY.BLUE);
palette.getColorFileCount();
palette.getColorFamilies();

// Version management
palette.bumpPatchVersion();  // 1.0.0 -> 1.0.1
palette.bumpMinorVersion();  // 1.0.0 -> 1.1.0
palette.bumpMajorVersion();  // 1.0.0 -> 2.0.0
```

### ColorPaletteRepository

Manages palette operations including loading colors across files.

```typescript
import { ColorPaletteRepository } from './models/color-palette';

const repo = new ColorPaletteRepository('./json-schema');

// Create a new palette
const palette = repo.createPalette({
    paletteName: 'My Palette',
    version: '1.0.0',
    author: 'Your Name',
    projectName: 'My Project',
    projectUrl: 'https://example.com',
    description: 'A beautiful palette',
    collectionFileName: 'my-colors.json',
    collectionDescription: 'Colors for my project'
});

// File operations
repo.saveToFile(palette, './palette.json');
const loaded = repo.loadFromFile('./palette.json');

// Load all colors from palette
const colorMap = repo.loadAllColors(palette, './data');

// Search across palette
repo.findColorById(palette, 'ABC123', './data');
repo.findColorsByName(palette, 'blue', './data');
repo.getColorsByFamily(palette, COLOR_FAMILY.BLUE, './data');

// Palette operations
const cloned = repo.clonePalette(palette, 'Cloned Palette', 'New Author');
const merged = repo.mergePalettes([palette1, palette2], options);
const summary = repo.getSummary(palette, './data');
```

---

## Type System

### Color Families

```typescript
import { COLOR_FAMILY } from './ts-color-types/color-enums';

COLOR_FAMILY.RED      // "Red Shades"
COLOR_FAMILY.ORANGE   // "Orange Shades"
COLOR_FAMILY.YELLOW   // "Yellow Shades"
COLOR_FAMILY.GREEN    // "Green Shades"
COLOR_FAMILY.BLUE     // "Blue Shades"
COLOR_FAMILY.PURPLE   // "Purple Shades"
COLOR_FAMILY.PINK     // "Pink Shades"
COLOR_FAMILY.BROWN    // "Brown Shades"
COLOR_FAMILY.GREY     // "Grey Shades"
COLOR_FAMILY.WHITE    // "White Shades"
COLOR_FAMILY.BLACK    // "Black Shades"
COLOR_FAMILY.OTHER    // "Other"
```

### Color Code Systems

```typescript
import { COLOR_CODE_SYSTEM_NAME } from './ts-color-types/color-enums';

COLOR_CODE_SYSTEM_NAME.HEX3   // "hex3"
COLOR_CODE_SYSTEM_NAME.HEX6   // "hex6"
COLOR_CODE_SYSTEM_NAME.HEX8   // "hex8"
COLOR_CODE_SYSTEM_NAME.RGB    // "rgb"
COLOR_CODE_SYSTEM_NAME.HSL    // "hsl"
COLOR_CODE_SYSTEM_NAME.CMYK   // "cmyk"
```

---

## JSON Maker API Reference

### Class: JsonMaker

#### Constructor

```typescript
new JsonMaker(schemaDir?: string)
```

- `schemaDir` - Directory containing schema files (default: `"./json-schema"`)

#### Methods

| Method | Description |
|--------|-------------|
| `loadSchema(schemaPath)` | Load a JSON schema from file |
| `getSchemaInfo(schemaPath)` | Get metadata about a schema |
| `validate(data, schemaPath)` | Validate data against a schema |
| `validateFile(filePath, schemaPath)` | Validate a JSON file |
| `validateFiles(filePaths, schemaPath)` | Validate multiple files |
| `readData(config)` | Read data from a source |
| `writeJson(data, outputPath, options?)` | Write data to JSON file |
| `createValidatedJson(data, schemaPath, outputPath, options?)` | Create JSON file with validation |
| `extractFields(data, fields)` | Extract specific fields from data |
| `transformData(data, transformer)` | Transform data using a function |
| `filterData(data, predicate)` | Filter data based on a predicate |
| `mergeJsonFiles(filePaths, outputPath)` | Merge multiple JSON files |
| `splitJsonFile(inputPath, outputDir, splitBy, fileNamePattern)` | Split JSON into multiple files |
| `generateTemplate(schemaPath)` | Generate empty object from schema |
| `listSchemas()` | List all available schemas |

### Convenience Functions

```typescript
validateJson(data, schemaPath): ValidationResult
validateJsonFile(filePath, schemaPath): ValidationResult
writeJson(data, outputPath, options?): void
readJson<T>(filePath): T
getSchemaInfo(schemaPath): SchemaInfo
```

### Interfaces

#### ValidationResult

```typescript
interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
```

#### ValidationError

```typescript
interface ValidationError {
    path: string;
    message: string;
    value?: unknown;
}
```

#### WriteOptions

```typescript
interface WriteOptions {
    prettyPrint?: boolean;    // Default: true
    indentSize?: number;      // Default: 4
    includeSchema?: boolean;  // Default: false
    schemaUrl?: string;
}
```

---

## Available Schemas

The following schemas are available in `./json-schema/`:

| Schema | Description |
|--------|-------------|
| `color-file-schema.json` | Individual color definitions |
| `color-collection-schema.json` | Color file collections |
| `color-palette-schema.json` | Color palettes with metadata |
| `color-families-schema.json` | Color family definitions |
| `color-code-formats-schema.json` | Color code format definitions |
| `website-theme-schema.json` | Website theme configurations |

### Schema Support

The validator supports JSON Schema draft-07 features including:

- Type validation (`string`, `number`, `integer`, `boolean`, `array`, `object`, `null`)
- Required fields
- Enum values
- String patterns (regex)
- Number ranges (`minimum`, `maximum`)
- String length (`minLength`, `maxLength`)
- Nested object validation
- Array item validation
- `oneOf` and `anyOf` combinators

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run convert` | Convert Coolors palettes to both output locations |
| `npm run convert:coolors` | Convert to Coolors schemas folder only |
| `npm run convert:server` | Convert to Color Server data folder only |

---

## License

ISC
