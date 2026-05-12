import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'dist/icons/lucide.svg');
const targetDir = path.join(root, 'examples/minimal-react/public/design-system/icons');

await mkdir(targetDir, { recursive: true });
await copyFile(source, path.join(targetDir, 'lucide.svg'));
console.log('Copied Lucide sprite into the minimal React example.');