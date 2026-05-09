// Syncs documentation from engine repository to docs repo
// Usage:
//   node scripts/sync-docs-from-engine.mjs --engine ../PixelRoot32-Game-Engine
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engineArgIndex = process.argv.indexOf('--engine');
const enginePath = engineArgIndex !== -1 && process.argv[engineArgIndex + 1] ? process.argv[engineArgIndex + 1] : './engine';
const docsSource = path.join(enginePath, 'docs');
const docsTarget = path.join(__dirname, '..');

const sections = ['guide', 'api', 'architecture', 'philosophy', 'migration', 'examples', 'tools'];

const excludedFiles = ['README.md', 'CHANGELOG.md', 'LICENSE', 'assets', 'img', 'images', '.vitepress', '.github'];

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

  addGitHubLinksToExamples();

  console.log('Docs sync complete.');
}

function addGitHubLinksToExamples() {
  const examplesDir = path.join(docsTarget, 'examples');
  
  if (!fs.existsSync(examplesDir)) {
    console.log('Examples directory not found, skipping link addition.');
    return;
  }

  const entries = fs.readdirSync(examplesDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }
    
    if (entry.name === 'demos.md') {
      continue;
    }

    const exampleNameKebab = path.basename(entry.name, '.md');
    const exampleNameSnake = exampleNameKebab.replace(/-/g, '_');
    const githubLink = `https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/${exampleNameSnake}`;
    const filePath = path.join(examplesDir, entry.name);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(githubLink)) {
      console.log(`Link already present in ${entry.name}, skipping.`);
      continue;
    }

    const linkToAdd = `\n\n---\n\n**Source code:** ${githubLink}\n`;
    fs.appendFileSync(filePath, linkToAdd, 'utf8');
    console.log(`Added GitHub link to ${entry.name}`);
  }
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