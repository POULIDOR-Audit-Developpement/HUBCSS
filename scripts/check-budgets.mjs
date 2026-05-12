import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const budgets = [
  { label: 'CSS', file: 'dist/global.css', raw: 96 * 1024, gzip: 32 * 1024 },
  { label: 'Lucide sprite', file: 'dist/icons/lucide.svg', raw: 96 * 1024, gzip: 24 * 1024 },
];

let failed = false;

for (const budget of budgets) {
  const absolute = path.join(root, budget.file);
  const data = await readFile(absolute);
  const gzipSize = gzipSync(data).length;
  const rawOk = data.length <= budget.raw;
  const gzipOk = gzipSize <= budget.gzip;

  console.log(`${budget.label}: ${data.length} bytes raw, ${gzipSize} bytes gzip`);

  if (!rawOk || !gzipOk) {
    failed = true;
    console.error(`${budget.label} budget exceeded for ${budget.file}`);
  }
}

if (failed) process.exit(1);