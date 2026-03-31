import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run "npm run build" before checking links.');
  process.exit(1);
}

const htmlFiles = [];
const issues = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function normalizeHref(rawHref) {
  if (!rawHref) return null;
  const href = rawHref.trim();
  if (!href) return null;
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')
  ) {
    return null;
  }

  const [withoutHash] = href.split('#');
  const [withoutQuery] = withoutHash.split('?');

  if (!withoutQuery.startsWith('/')) return null;
  return withoutQuery;
}

function existsForHref(href) {
  if (href === '/') {
    return fs.existsSync(path.join(distDir, 'index.html'));
  }

  const cleanPath = href.replace(/^\/+/, '');
  const directPath = path.join(distDir, cleanPath);

  const candidates = [
    directPath,
    `${directPath}.html`,
    path.join(directPath, 'index.html'),
  ];

  return candidates.some((candidate) => fs.existsSync(candidate));
}

walk(distDir);

for (const file of htmlFiles) {
  const contents = fs.readFileSync(file, 'utf8');
  const matches = contents.matchAll(/\b(?:href|src)="([^"]+)"/g);

  for (const match of matches) {
    const href = normalizeHref(match[1]);
    if (!href) continue;

    if (!existsForHref(href)) {
      issues.push({
        file: path.relative(distDir, file).replace(/\\/g, '/'),
        href,
      });
    }
  }
}

if (issues.length) {
  console.error('Broken internal links or asset references found in dist:');
  for (const issue of issues) {
    console.error(`- ${issue.file} -> ${issue.href}`);
  }
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. No broken internal links found.`);
