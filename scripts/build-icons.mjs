import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'src/icons/icons.manifest.json');
const outputPath = path.join(root, 'dist/icons/lucide.svg');

function packageDirectory(packageName) {
  try {
    return path.dirname(require.resolve(`${packageName}/package.json`));
  } catch {
    return null;
  }
}

function findLucideIconDirectory() {
  const lucideStatic = packageDirectory('lucide-static');
  const candidates = [
    lucideStatic && path.join(lucideStatic, 'icons'),
    lucideStatic && path.join(lucideStatic, 'svg'),
  ].filter(Boolean);

  const match = candidates.find((candidate) => existsSync(candidate));
  if (!match) {
    throw new Error('Lucide SVG sources were not found. Run npm install and make sure lucide-static is installed.');
  }
  return match;
}

function validateIconName(name) {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(`Invalid icon name in manifest: ${name}`);
  }
}

function parseSvg(svg, iconName) {
  const match = svg.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!match) {
    throw new Error(`Invalid SVG for icon: ${iconName}`);
  }

  const attributes = match[1];
  const body = match[2].trim();
  const viewBox = attributes.match(/viewBox="([^"]+)"/i)?.[1] ?? '0 0 24 24';

  return { viewBox, body };
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('Icon manifest must be a non-empty array.');
}

const uniqueIcons = [...new Set(manifest)].sort();
if (uniqueIcons.length !== manifest.length) {
  throw new Error('Icon manifest contains duplicate names.');
}

const iconDirectory = findLucideIconDirectory();
const symbols = [];

for (const iconName of uniqueIcons) {
  validateIconName(iconName);
  const sourcePath = path.join(iconDirectory, `${iconName}.svg`);
  const svg = await readFile(sourcePath, 'utf8').catch(() => null);
  if (!svg) {
    throw new Error(`Lucide icon not found: ${iconName}`);
  }

  const { viewBox, body } = parseSvg(svg, iconName);
  symbols.push([
    `  <symbol id="icon-${iconName}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    body.split('\n').map((line) => `    ${line.trim()}`).join('\n'),
    '  </symbol>',
  ].join('\n'));
}

const sprite = [
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">',
  ...symbols,
  '</svg>',
  '',
].join('\n');

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, sprite, 'utf8');
console.log(`Generated ${uniqueIcons.length} Lucide symbols at ${path.relative(root, outputPath)}`);