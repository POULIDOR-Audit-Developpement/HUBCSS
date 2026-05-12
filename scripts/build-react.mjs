import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'dist/react');

await mkdir(outputDir, { recursive: true });
await copyFile(path.join(root, 'src/react/Icon.js'), path.join(outputDir, 'Icon.js'));
await copyFile(path.join(root, 'src/react/Icon.d.ts'), path.join(outputDir, 'Icon.d.ts'));