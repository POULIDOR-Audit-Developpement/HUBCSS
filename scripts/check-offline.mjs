import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scanRoots = ['src', 'dist', 'docs', 'examples', 'nginx'];
const scannedExtensions = new Set(['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.md', '.json', '.svg', '.conf']);
const forbiddenTokens = [
  /fonts\.googleapis/i,
  /fonts\.gstatic/i,
  /unpkg\.com/i,
  /jsdelivr\.net/i,
  /cdnjs\.cloudflare\.com/i,
  /bootstrapcdn\.com/i,
  /cdn\./i,
];

function isAllowedLocalUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1') return true;
    if (host === 'www.w3.org' && parsed.pathname === '/2000/svg') return true;
    if (/^10\./.test(host) || /^192\.168\./.test(host)) return true;
    const private172 = host.match(/^172\.(\d+)\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return true;
    return false;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    if (entry === 'package-lock.json' || entry === 'npm-shrinkwrap.json') continue;
    const absolute = path.join(directory, entry);
    const info = await stat(absolute);
    if (info.isDirectory()) {
      files.push(...await collectFiles(absolute));
    } else if (scannedExtensions.has(path.extname(entry))) {
      files.push(absolute);
    }
  }

  return files;
}

const failures = [];

for (const scanRoot of scanRoots) {
  const absoluteRoot = path.join(root, scanRoot);
  if (!existsSync(absoluteRoot)) continue;

  const files = await collectFiles(absoluteRoot);
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const relative = path.relative(root, file);

    for (const token of forbiddenTokens) {
      if (token.test(content)) failures.push(`${relative}: forbidden external token ${token}`);
    }

    for (const match of content.matchAll(/https?:\/\/[^\s)"'<>]+/gi)) {
      if (!isAllowedLocalUrl(match[0])) failures.push(`${relative}: external URL ${match[0]}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Offline check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Offline check passed: no external runtime asset URLs found.');