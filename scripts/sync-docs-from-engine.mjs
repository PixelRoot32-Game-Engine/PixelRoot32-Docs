import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engineArgIndex = process.argv.indexOf('--engine');
const enginePath = engineArgIndex !== -1 && process.argv[engineArgIndex + 1] ? process.argv[engineArgIndex + 1] : './engine';
const docsSource = path.join(enginePath, 'docs');
const docsTarget = path.join(__dirname, '..');

const sections = ['guide', 'api', 'architecture', 'philosophy', 'migration', 'examples', 'tools'];

const excludedFiles = ['README.md', 'CHANGELOG.md', 'LICENSE', 'assets', 'img', 'images', '.vitepress'];

function syncDocs() {
  console.log(`Syncing docs from ${enginePath}...`);
  
  if (!fs.existsSync(docsSource)) {
    console.error(`Error: Engine docs not found at ${docsSource}`);
    process.exit(1);
  }

  for (const section of sections) {
    const srcDir = path.join(docsSource, section);
    const destDir = path.join(docsTarget, section);
    const destLegacy = path.join(docsTarget, '_legacy_vitepress', section);

    if (fs.existsSync(srcDir)) {
      copyDirRecursive(srcDir, destDir, excludedFiles);
      console.log(`Synced ${section}/`);
    }

    if (fs.existsSync(destDir)) {
      fs.cpSync(destDir, destLegacy, { recursive: true, force: true });
    }
  }

  console.log('Docs sync complete.');
}

function copyDirRecursive(src, dest, excluded) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (excluded.includes(entry.name)) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excluded);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

syncDocs();