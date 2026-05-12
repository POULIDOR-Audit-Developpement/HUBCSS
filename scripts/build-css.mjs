import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const input = path.join(root, 'src/styles/global.css');
const output = path.join(dist, 'global.css');
const fontsInput = path.join(root, 'src/styles/fonts.css');
const fontsOutput = path.join(dist, 'fonts.css');
const tailwindBin = process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss';

await mkdir(dist, { recursive: true });

try {
  execFileSync(tailwindBin, ['-i', input, '-o', output, '--minify'], {
    cwd: root,
    stdio: 'inherit',
  });
} catch (error) {
  throw new Error('Tailwind CSS build failed. Run npm install in the design-system package, then retry npm run build.');
}

await copyFile(fontsInput, fontsOutput);

const compiledCss = await readFile(output, 'utf8');
const cssWithoutExternalBanner = compiledCss.replace(/\/\*![\s\S]*?tailwindcss\.com[\s\S]*?\*\//i, '');
if (cssWithoutExternalBanner !== compiledCss) {
  await writeFile(output, cssWithoutExternalBanner.trimStart(), 'utf8');
}