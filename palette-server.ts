/**
 * Palette Viewer Server
 *
 * Simple HTTP server that serves:
 * - Static HTML page with Preact components
 * - API endpoints for palette data
 *
 * Usage:
 *   npx sucrase-node palette-server.ts
 *   npm run serve
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const PORT = 3333;
const PALETTES_DIR = path.join(__dirname, 'data', 'palettes');
const COLORS_DIR = path.join(__dirname, 'data', 'color-files');
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static files
const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

/**
 * Get list of all palette files
 */
function getPaletteList(): { name: string; file: string }[] {
    const files = fs.readdirSync(PALETTES_DIR);
    return files
        .filter(f => f.endsWith('-palette.json'))
        .map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(PALETTES_DIR, file), 'utf-8'));
            return {
                name: data['palette-name'] || file.replace('-palette.json', ''),
                file: file
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get palette data with resolved colors
 */
function getPaletteData(filename: string): object | null {
    const palettePath = path.join(PALETTES_DIR, filename);

    if (!fs.existsSync(palettePath)) {
        return null;
    }

    const palette = JSON.parse(fs.readFileSync(palettePath, 'utf-8'));
    const colors: object[] = [];

    // Resolve each color file reference
    if (palette.collection && palette.collection['color-files']) {
        for (const colorRef of palette.collection['color-files']) {
            const colorFilePath = colorRef['file-path'];
            // Extract just the filename from the path
            const colorFilename = path.basename(colorFilePath);
            const fullPath = path.join(COLORS_DIR, colorFilename);

            if (fs.existsSync(fullPath)) {
                const colorData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                // Color files contain arrays, get first item
                if (Array.isArray(colorData) && colorData.length > 0) {
                    colors.push(colorData[0]);
                }
            }
        }
    }

    return {
        ...palette,
        resolvedColors: colors
    };
}

/**
 * Send JSON response
 */
function sendJSON(res: http.ServerResponse, data: object, status = 200): void {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

/**
 * Serve static file
 */
function serveStatic(res: http.ServerResponse, filePath: string): void {
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not Found');
        return;
    }

    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
}

/**
 * Request handler
 */
function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`);
    const pathname = url.pathname;

    console.log(`${req.method} ${pathname}`);

    // API routes
    if (pathname === '/api/palettes') {
        const palettes = getPaletteList();
        sendJSON(res, { palettes });
        return;
    }

    if (pathname.startsWith('/api/palette/')) {
        const filename = pathname.replace('/api/palette/', '');
        const data = getPaletteData(filename);

        if (data) {
            sendJSON(res, data);
        } else {
            sendJSON(res, { error: 'Palette not found' }, 404);
        }
        return;
    }

    // Static files
    if (pathname === '/' || pathname === '/index.html') {
        serveStatic(res, path.join(PUBLIC_DIR, 'index.html'));
        return;
    }

    // Serve other static files
    serveStatic(res, path.join(PUBLIC_DIR, pathname));
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`\n=== Palette Viewer Server ===`);
    console.log(`Running at: http://localhost:${PORT}`);
    console.log(`Palettes: ${getPaletteList().length} available`);
    console.log(`\nPress Ctrl+C to stop\n`);
});
